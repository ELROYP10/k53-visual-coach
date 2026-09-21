import { useEffect, useState } from 'react'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export default function InstallApp() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [installed, setInstalled] = useState(() => isStandalone())
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)

  useEffect(() => {
    const capturePrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const markInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
      setShowIosHelp(false)
    }

    window.addEventListener('beforeinstallprompt', capturePrompt)
    window.addEventListener('appinstalled', markInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt)
      window.removeEventListener('appinstalled', markInstalled)
    }
  }, [])

  if (installed || (!installPrompt && !isIos)) return null

  const install = async () => {
    if (installPrompt) {
      installPrompt.prompt()
      await installPrompt.userChoice
      setInstallPrompt(null)
    } else {
      setShowIosHelp(true)
    }
  }

  return (
    <>
      <button className="pwa-install-button" type="button" onClick={install} aria-label="Install K53 Visual Coach app">
        <span aria-hidden="true">↓</span> Install app
      </button>
      {showIosHelp && (
        <div className="pwa-install-backdrop" role="presentation" onClick={() => setShowIosHelp(false)}>
          <section className="pwa-install-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-install-title" onClick={(event) => event.stopPropagation()}>
            <div className="pwa-install-icon" aria-hidden="true">🚦</div>
            <h2 id="pwa-install-title">Install K53 Visual Coach</h2>
            <p>Tap the <strong>Share</strong> button in Safari, then choose <strong>Add to Home Screen</strong>.</p>
            <button type="button" onClick={() => setShowIosHelp(false)}>Got it</button>
          </section>
        </div>
      )}
      <style>{`
        .pwa-install-button{position:fixed;right:18px;bottom:max(18px,env(safe-area-inset-bottom));z-index:1000;border:1px solid #56ee91;border-radius:999px;background:#20cc66;color:#06150d;padding:12px 18px;font:800 15px/1 system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px #0008;cursor:pointer}.pwa-install-button span{font-size:19px;margin-right:5px}.pwa-install-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:end center;background:#000b;padding:20px}.pwa-install-dialog{box-sizing:border-box;width:min(100%,440px);border:1px solid #2d6a55;border-radius:22px;background:#071b18;color:#f4fff8;padding:24px;text-align:center;box-shadow:0 18px 60px #000}.pwa-install-icon{font-size:40px}.pwa-install-dialog h2{margin:10px 0;font:800 24px/1.15 system-ui,-apple-system,sans-serif}.pwa-install-dialog p{margin:0 0 20px;color:#cde6d9;font:400 16px/1.55 system-ui,-apple-system,sans-serif}.pwa-install-dialog button{width:100%;border:0;border-radius:12px;background:#20cc66;color:#06150d;padding:13px;font:800 15px system-ui,-apple-system,sans-serif;cursor:pointer}@media (max-width:600px){.pwa-install-button{right:12px;bottom:max(12px,env(safe-area-inset-bottom));padding:11px 15px}}
      `}</style>
    </>
  )
}
