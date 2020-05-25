module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://trans.zhencai.xyz/api',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}