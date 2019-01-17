module.exports = function (__dirname) {
	return {
		findProjectDir: function () {
			return findProjectDir(__dirname);
		},
		postinstall: function () {
			return postinstall(__dirname);
		},
		preuninstall: function () {
			return preuninstall(__dirname);
		}
	};
};

var fs = require('fs');
var os = require('os');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var glob = require('glob');

function generateHookName(pkg, hook) {
	return pkg.name + '.js';
}

function findProjectDir(pkgdir) {
	if (process.env.INIT_CWD && _isNativeScriptAppRoot(process.env.INIT_CWD)) {
		return process.env.INIT_CWD;
	}

	var candidateDir = pkgdir;
	var oldCandidateDir = null;

	while (true) {
		candidateDir = path.dirname(candidateDir);
		if (oldCandidateDir === candidateDir) {
			return;
		}

		if (path.basename(candidateDir) === 'node_modules') {
			continue;
		}

		if (_isNativeScriptAppRoot(candidateDir)) {
			return candidateDir;
		}

		oldCandidateDir = candidateDir;
	}
}

function _isNativeScriptAppRoot(dir) {
	var isNativeScriptAppRoot = false;
	var packageJsonFile = path.join(dir, 'package.json');
	if (fs.existsSync(packageJsonFile)) {
		var packageJsonContent = require(packageJsonFile);
		isNativeScriptAppRoot = !!packageJsonContent.nativescript && !!packageJsonContent.nativescript.id;
	}

	return isNativeScriptAppRoot;
}

function forEachHook(pkgdir, callback) {
	var pkg = require(path.join(pkgdir, 'package.json'));
	var ns = pkg.nativescript;
	if (!ns) {
		throw Error('Not a NativeScript development module.');
	}

	var projectDir = findProjectDir(pkgdir);
	if (!projectDir) {
		return;
	}
	var hooksDir = path.join(projectDir, 'hooks');

	if (ns.hooks) {
		ns.hooks.forEach(function (hook) {
			callback(hooksDir, pkg, hook);
		});
	}
}

function hookInstalled(hookDir, pkg, hook) {
	var hookBaseName = pkg.name;
	var hookGlob = path.join(hookDir, "*" + hookBaseName + "*");
	var files = glob.sync(hookGlob);
	return files.length > 0;
}

function postinstall(pkgdir) {
	forEachHook(pkgdir, function (hooksDir, pkg, hook) {
		var hookDir = path.join(hooksDir, hook.type);
		if (!fs.existsSync(hookDir)) {
			mkdirp.sync(hookDir);
		}
		if (hookInstalled(hookDir, pkg, hook)) {
			console.log(`Hook already installed: ${pkg.name} at location: ${hookDir}`);
			return;
		}
		var hookFileName = generateHookName(pkg, hook);
		var hookPath = path.join(hookDir, hookFileName);

		var trampoline = util.format('%srequire("%s/%s");', hook.inject ? 'module.exports = ' : '', pkg.name, hook.script);

		fs.writeFileSync(hookPath, trampoline + os.EOL);
	});
}

function preuninstall(pkgdir) {
	forEachHook(pkgdir, function (hooksDir, pkg, hook) {
		var hookDir = path.join(hooksDir, hook.type);
		var hookFileName = generateHookName(pkg, hook);
		var hookPath = path.join(hookDir, hookFileName);

		try {
			if (fs.existsSync(hookPath)) {
				fs.unlinkSync(hookPath);
			}
		} catch (err) {
			console.warn('nativescript-hook: ' + err.toString());
		}
	});
}
