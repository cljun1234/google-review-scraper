const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const cliProgress = require('cli-progress');
const Table = require('cli-table3');
const ora = require('ora');
class Display {
  constructor() {
    this.progressBar = null;
    this.spinner = null;
  }
  showBanner() {
    console.clear();
    const banner = figlet.textSync('MAPS SCRAPER', {
      font: 'ANSI Shadow',
      horizontalLayout: 'default'
    });
    console.log(gradient.pastel.multiline(banner));
    console.log(chalk.cyan.bold('  🔥 Google Reviews Scraper v1.0.0\n'));
    console.log(chalk.gray('  The most powerful reviews extraction tool\n'));
  }
  section(title) {
    console.log('\n' + chalk.bold.cyan('═'.repeat(60)));
    console.log(chalk.bold.white(`  ${title}`));
    console.log(chalk.bold.cyan('═'.repeat(60)) + '\n');
  }
  success(message) {
    console.log(chalk.green('✓ ') + chalk.white(message));
  }
  error(message) {
    console.log(chalk.red('✗ ') + chalk.white(message));
  }
  warning(message) {
    console.log(chalk.yellow('⚠ ') + chalk.white(message));
  }
  info(message) {
    console.log(chalk.blue('ℹ ') + chalk.white(message));
  }
  createProgressBar(total, label = 'Progress') {
    this.progressBar = new cliProgress.SingleBar({
      format: chalk.cyan(label + ' |') + chalk.green('{bar}') + chalk.cyan('| {percentage}% | {value}/{total} reviews'),
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    this.progressBar.start(total, 0);
    return this.progressBar;
  }
  updateProgress(value) {
    if (this.progressBar) {
      this.progressBar.update(value);
    }
  }
  stopProgress() {
    if (this.progressBar) {
      this.progressBar.stop();
      this.progressBar = null;
    }
  }
  startSpinner(text) {
    if (this.spinner) {
      this.spinner.stop();
    }
    this.spinner = ora({
      text: chalk.cyan(text),
      color: 'cyan',
      spinner: 'dots'
    }).start();
    return this.spinner;
  }
  succeedSpinner(text) {
    if (this.spinner) {
      this.spinner.succeed(chalk.green(text));
      this.spinner = null;
    }
  }
  
  failSpinner(text) {
    if (this.spinner) {
      this.spinner.fail(chalk.red(text));
      this.spinner = null;
    }
  }
  showConfig(config) {
    const table = new Table({
      head: [chalk.cyan.bold('Setting'), chalk.cyan.bold('Value')],
      colWidths: [30, 50],
      style: {
        head: [],
        border: ['gray']
      }
    });
    table.push(
      ['URL', chalk.white(config.url.substring(0, 47) + '...')],
      ['Headless Mode', config.headless ? chalk.green('Yes') : chalk.yellow('No')],
      ['Sort By', chalk.white(config.sortBy || 'relevance')],
      ['Download Images', config.downloadImages ? chalk.green('Yes') : chalk.gray('No')],
      ['Output Directory', chalk.white(config.baseDir || './data')]
    );
    console.log(table.toString());
    console.log('');
  }
  showStats(stats) {
    this.section('📊 Scraping Results');
    const table = new Table({
      head: [chalk.cyan.bold('Metric'), chalk.cyan.bold('Value')],
      colWidths: [30, 30],
      style: {
        head: [],
        border: ['gray']
      }
    });
    table.push(
      ['Total Reviews', chalk.green.bold(stats.totalReviews)],
      ['Average Rating', chalk.yellow.bold(stats.avgRating.toFixed(2) + ' ⭐')],
      ['5-Star Reviews', chalk.green(stats.ratings[5] || 0)],
      ['4-Star Reviews', chalk.green(stats.ratings[4] || 0)],
      ['3-Star Reviews', chalk.yellow(stats.ratings[3] || 0)],
      ['2-Star Reviews', chalk.red(stats.ratings[2] || 0)],
      ['1-Star Reviews', chalk.red(stats.ratings[1] || 0)],
      ['Reviews with Text', chalk.white(stats.withText)],
      ['Reviews with Images', chalk.white(stats.withImages)],
      ['Owner Responses', chalk.white(stats.withOwnerResponse)]
    );
    console.log(table.toString());
    console.log('');
  }
  showSampleReviews(reviews, count = 3) {
    this.section('📝 Sample Reviews');
    reviews.slice(0, count).forEach((review, index) => {
      console.log(chalk.bold.white(`Review #${index + 1}`));
      console.log(chalk.cyan('  Name: ') + chalk.white(review.name));
      console.log(chalk.cyan('  Rating: ') + chalk.yellow('⭐'.repeat(review.rating)));
      console.log(chalk.cyan('  Date: ') + chalk.gray(review.date || 'N/A'));
      if (review.text && review.text !== 'No review text') {
        const preview = review.text.length > 100
          ? review.text.substring(0, 100) + '...'
          : review.text;
        console.log(chalk.cyan('  Review: ') + chalk.white(preview));
      }
      if (review.ownerResponse) {
        console.log(chalk.cyan('  Owner: ') + chalk.magenta('Responded ✓'));
      }
      console.log('');
    });
  }
  showSummary(data) {
    console.log('\n');
    console.log(chalk.green.bold('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green.bold('║') + chalk.white.bold('              ✓ SCRAPING COMPLETED SUCCESSFULLY              ') + chalk.green.bold('║'));
    console.log(chalk.green.bold('╚════════════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.white(`  📁 Data saved to: ${chalk.cyan.bold(data.outputFile)}`));
    console.log(chalk.white(`  📊 Total reviews: ${chalk.green.bold(data.count)}`));
    if (data.imagesDownloaded) {
      console.log(chalk.white(`  🖼️  Images downloaded: ${chalk.green.bold(data.imagesDownloaded)}`));
    }
    console.log('');
  }
}
module.exports = new Display();
