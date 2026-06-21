module.exports = function (eleventyConfig) {
  // Copy these straight through to the built site, untouched.
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/script.js");

  // The CMS admin is a static app — copy it verbatim, don't run it through Eleventy.
  eleventyConfig.ignores.add("src/admin");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Newest-first blog collection (Eleventy sorts by date ascending).
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByTag("post").reverse()
  );

  // "June 18, 2026"
  eleventyConfig.addFilter("readableDate", (value) =>
    new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // First N items of an array (used to cap the homepage grid).
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Turn a possibly-relative path into an absolute URL for Open Graph tags.
  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    if (!url) return base || "";
    if (/^https?:\/\//.test(url)) return url;
    return (base || "") + url;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
