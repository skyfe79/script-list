#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BINARY_NAME = 'sl';
const GITHUB_REPO = 'skyfe79/script-list';
const BIN_DIR = path.join(__dirname, 'bin');

// Platform and architecture mapping
const PLATFORM_MAP = {
  'darwin': 'macos',
  'linux': 'linux',
  'win32': 'windows'
};

const ARCH_MAP = {
  'x64': 'x64',
  'arm64': 'arm64'
};

function getPlatform() {
  const platform = process.platform;
  const arch = process.arch;
  
  const mappedPlatform = PLATFORM_MAP[platform];
  const mappedArch = ARCH_MAP[arch];
  
  if (!mappedPlatform || !mappedArch) {
    throw new Error(`Unsupported platform: ${platform} ${arch}`);
  }
  
  return { platform: mappedPlatform, arch: mappedArch };
}

function getBinaryUrl(version, platform, arch) {
  // For now, only support macOS ARM64 (build others as needed)
  if (platform === 'macos' && arch === 'arm64') {
    return `https://github.com/${GITHUB_REPO}/releases/download/v${version}/sl-v${version}-macos-arm64.tar.gz`;
  }
  // Fallback to macOS x64 for other platforms (or build specific binaries)
  return `https://github.com/${GITHUB_REPO}/releases/download/v${version}/sl-v${version}-macos-arm64.tar.gz`;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'npm-install-script' } }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function extractTarGz(tarPath, destDir) {
  try {
    execSync(`tar -xzf "${tarPath}" -C "${destDir}"`, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to extract: ${error.message}`);
  }
}

async function install() {
  try {
    // Read version from package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const version = packageJson.version;
    
    console.log(`Installing script-list v${version}...`);
    
    // Get platform info
    const { platform, arch } = getPlatform();
    console.log(`Platform: ${platform} ${arch}`);
    
    // Create bin directory
    if (!fs.existsSync(BIN_DIR)) {
      fs.mkdirSync(BIN_DIR, { recursive: true });
    }
    
    const binaryPath = path.join(BIN_DIR, BINARY_NAME);
    
    // Check if already installed
    if (fs.existsSync(binaryPath)) {
      console.log('Binary already exists, skipping download.');
      return;
    }
    
    // Download binary
    const downloadUrl = getBinaryUrl(version, platform, arch);
    const tempFile = path.join(__dirname, 'sl.tar.gz');
    
    console.log(`Downloading from: ${downloadUrl}`);
    await downloadFile(downloadUrl, tempFile);
    
    // Extract
    console.log('Extracting...');
    extractTarGz(tempFile, BIN_DIR);
    
    // Make executable (Unix only)
    if (process.platform !== 'win32') {
      fs.chmodSync(binaryPath, 0o755);
    }
    
    // Create symlink in npm global bin directory for global installs
    try {
      const npmGlobalBin = execSync('npm bin -g', { encoding: 'utf8' }).trim();
      if (npmGlobalBin && fs.existsSync(npmGlobalBin)) {
        const globalLink = path.join(npmGlobalBin, BINARY_NAME);
        if (!fs.existsSync(globalLink)) {
          fs.symlinkSync(binaryPath, globalLink);
          console.log(`Created global symlink: ${globalLink}`);
        }
      }
    } catch (e) {
      // Ignore if npm bin -g fails (local install)
    }
    
    // Cleanup
    fs.unlinkSync(tempFile);
    
    console.log('✅ Installation complete!');
    console.log(`Binary location: ${binaryPath}`);
    console.log('You can now use: sl');
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.error('');
    console.error('You can manually download the binary from:');
    console.error(`https://github.com/${GITHUB_REPO}/releases`);
    process.exit(1);
  }
}

install();
