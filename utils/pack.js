const fs = require("fs/promises");

// Copy UMD files to builds directory based on package.json version
const copyUmdToBuilds = async () => {
  try {
    const packageJsonUnparsed = await fs.readFile("package.json");
    const packageJson = JSON.parse(packageJsonUnparsed);

    const version = packageJson.version;

    const buildFolder = `./builds/${version}`;

    await fs.mkdir(buildFolder, { recursive: true });

    await Promise.all([
      fs.copyFile("./dist/index.js", `${buildFolder}/index.js`),
      fs.copyFile("./dist/index.js.map", `${buildFolder}/index.js.map`),
      fs.copyFile("./dist/styles.css", `${buildFolder}/styles.css`),
    ]);

    await Promise.all([fs.rm("./dist/index.js"), fs.rm("./dist/index.js.map")]);

    console.log(`Builds for version ${version} copied successfully`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

async function main() {
  await copyUmdToBuilds();
}

main();
