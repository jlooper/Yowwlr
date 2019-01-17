var fs = require("fs");
var path = require("path");

var __migrations = [
	inlineSourceMapMigration,
	addDomLibs,
	addIterableToAngularProjects,
	addTnsCoreModulesPathMappings,
];

function migrateProject(tsConfig, tsconfigPath, projectDir) {
	var displayableTsconfigPath = path.relative(projectDir, tsconfigPath);
	__migrations.forEach(function (migration) {
		migration(tsConfig, displayableTsconfigPath, projectDir);
	});
}
exports.migrateProject = migrateProject;

function migrateTsConfig(tsconfigPath, projectDir) {
	var displayableTsconfigPath = path.relative(projectDir, tsconfigPath);

	function withTsConfig(action) {
		var existingConfig = null;
		try {
			var existingConfigContents = fs.readFileSync(tsconfigPath);
			existingConfig = JSON.parse(existingConfigContents);
		} catch (e) {
			console.error("Invalid " + displayableTsconfigPath + ": " + e);
			return;
		}
		action(existingConfig);
		fs.writeFileSync(tsconfigPath, JSON.stringify(existingConfig, null, 4));
	}

	withTsConfig(function (existingConfig) {
		migrateProject(existingConfig, displayableTsconfigPath, projectDir);
	});
}
exports.migrateTsConfig = migrateTsConfig;

function inlineSourceMapMigration(existingConfig, displayableTsconfigPath) {
	if (existingConfig.compilerOptions) {
		if ("sourceMap" in existingConfig["compilerOptions"]) {
			delete existingConfig["compilerOptions"]["sourceMap"];
			console.warn("> Deleted \"compilerOptions.sourceMap\" setting in \"" + displayableTsconfigPath + "\".");
			console.warn("> Inline source maps will be used when building in Debug configuration from now on.");
		}
	}
}

function addIterableToAngularProjects(existingConfig, displayableTsconfigPath, projectDir) {
	var packageJsonPath = path.join(projectDir, "package.json");
	var packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
	var dependencies = packageJson.dependencies || [];

	var hasAngular = Object.keys(dependencies).includes("nativescript-angular");
	if (hasAngular) {
		console.log("Adding 'es2015.iterable' lib to tsconfig.json...");
		addTsLib(existingConfig, "es2015.iterable");
	}
}

function addDomLibs(existingConfig, displayableTsconfigPath, projectDir) {
	console.log("Adding 'es6' lib to tsconfig.json...");
	addTsLib(existingConfig, "es6");
	console.log("Adding 'dom' lib to tsconfig.json...");
	addTsLib(existingConfig, "dom");
}

function addTsLib(existingConfig, libName) {
	if (existingConfig.compilerOptions) {
		var options = existingConfig.compilerOptions;
		if (!options.lib) {
			options.lib = [];
		}
		if (!options.lib.find(function (l) {
			return libName.toLowerCase() === l.toLowerCase();
		})) {
			options.lib.push(libName);
		}
	}
}

function addTnsCoreModulesPathMappings(existingConfig, displayableTsconfigPath, projectDir) {
	console.log("Adding tns-core-modules path mappings lib to tsconfig.json...");
	existingConfig["compilerOptions"] = existingConfig["compilerOptions"] || {};
	var compilerOptions = existingConfig["compilerOptions"];
	compilerOptions["baseUrl"] = ".";
	compilerOptions["paths"] = compilerOptions["paths"] || {};

	const appPath = getAppPath(projectDir);
	compilerOptions["paths"]["~/*"] = compilerOptions["paths"]["~/*"] || [
		`${appPath}/*`
	];
	compilerOptions["paths"]["*"] = compilerOptions["paths"]["*"] || [
		"./node_modules/tns-core-modules/*",
		"./node_modules/*"
	];
}

function getAppPath(projectDir) {
	const DEFAULT_PATH = "app";
	const nsConfigPath = path.join(projectDir, "nsconfig.json");

	try {
		const nsConfig = JSON.parse(fs.readFileSync(nsConfigPath));
		const appPath = nsConfig && nsConfig.appPath;
		return appPath || DEFAULT_PATH;
	} catch (_) {
		return DEFAULT_PATH;
	}
}
