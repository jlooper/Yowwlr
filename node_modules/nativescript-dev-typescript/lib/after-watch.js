var compiler = require('./compiler');

module.exports = function ($logger) {
	var tsc = compiler.getTscProcess();
	if (tsc) {
		$logger.info("Stopping tsc watch");
		tsc.kill("SIGINT")
	}
}
