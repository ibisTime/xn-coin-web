fis.match('*', {
    release: '/static/$0'
});

fis.match('*.html', {
    release: '/$0'
});
fis.match('*.{css,less,scss}', {
  preprocessor: fis.plugin('autoprefixer', {
    "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
    "cascade": true
  })
})
fis.match('**/*.scss', {
    rExt: '.css',
    parser: fis.plugin('node-sass', {})
});
fis.match('/js/**.js', {
    parser: fis.plugin('babel-6.x', {
        sourceMaps: true,
        presets: [
            'latest', 'es2016', 'ES2015', 'stage-0'
        ]
    }),
    rExt: 'js'
});
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        allInOne: false,
        sourceMap: true,
        useInlineMap: true
    })
});

fis.media("prod").match('*.{js,css}', {
    useHash: true
});

fis.media("prod").match("**.js", {
    optimizer: fis.plugin('uglify-js')
});

fis.media("prod").match("config.js", {
    optimizer: null,
    useHash: false
});

fis.media("prod").match("**.css", {
    optimizer: fis.plugin('clean-css')
});

fis.media('prod').match('*.png', {
    optimizer: fis.plugin('png-compressor')
});