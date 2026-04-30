export function Footer() {
  return (
    <footer className="border-t border-white/30 backdrop-blur-xl bg-white/10 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <span className="font-semibold text-gray-700">码经</span>
              <span className="text-xs text-gray-500 ml-2">CodeBible - 你的代码宝典</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-600 transition-colors">关于我们</a>
            <a href="#" className="hover:text-primary-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-primary-600 transition-colors">使用条款</a>
            <a href="#" className="hover:text-primary-600 transition-colors">联系我们</a>
          </div>

          <p className="text-sm text-gray-400">
            © 2026 码经 CodeBible. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
