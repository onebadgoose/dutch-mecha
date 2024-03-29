const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

// Import fast-glob package
const fg = require('fast-glob');





module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);
  
  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);



  // In your .eleventy.js file
  eleventyConfig.addFilter("shuffle", array => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  });


  
  
  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
      );
    });
    
    
    
    // Syntax Highlighting for Code blocks
    eleventyConfig.addPlugin(syntaxHighlight);
    
    // To Support .yaml Extension in _data
    // You may remove this if you can use JSON
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    
    // Copy Static Files to /_Site
    eleventyConfig.addPassthroughCopy({
      "./src/admin/config.yml": "./admin/config.yml",
      "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
      "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
    });
    
    // Copy Image Folder to /_site
    eleventyConfig.addPassthroughCopy("./src/static/img");
    
    // Copy favicon to route of /_site
    eleventyConfig.addPassthroughCopy("./src/favicon.ico");
    

    // Run search for images in /static/img
const mainImages = fg.sync(['**/img/**/*.{jpg,png,webp}', '!**/_site']);


// Create collection of gallery images
eleventyConfig.addCollection('images', function (collection) {
  return mainImages.map(imagePath => {
    // Assuming your site is hosted at the root and _site is the output directory
    return '/static/img/' + imagePath.split('/').pop();
  });
});




  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });




  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };



};