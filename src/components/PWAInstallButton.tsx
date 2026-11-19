import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary';
  showDesktopFallback?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'secondary',
  showDesktopFallback = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const baseClass =
    variant === 'primary'
      ? 'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#141413] hover:bg-[#2A2927] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] focus-visible:ring-offset-2'
      : 'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm font-medium text-[#141413] bg-white border border-[#E2DFD7] hover:bg-[#F3F2EE] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8231A] focus-visible:ring-offset-2';

  if (isInstallable) {
    return (
      <button onClick={install} className={baseClass} type="button">
        <Download className="w-4 h-4" />
        Install App
      </button>
    );
  }

  if (isIOS || showDesktopFallback) {
    return (
      <>
        <button
          onClick={() => setShowGuide(true)}
          className={baseClass}
          type="button"
        >
          <Smartphone className="w-4 h-4" />
          {isIOS ? 'Install on iOS' : 'Get Mobile App'}
        </button>

        {showGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-guide-title"
          >
            <div className="w-full max-w-md rounded-2xl bg-white border border-[#E6E4DD] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 id="pwa-guide-title" className="font-display text-xl font-bold text-[#141413]">
                    {isIOS ? 'Install Stack House on iOS' : 'Install Stack House App'}
                  </h3>
                  <p className="mt-1 text-sm text-[#57554E]">
                    Add Stack House to your home screen for one-tap ordering and offline menu access.
                  </p>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-[#57554E] hover:bg-[#F3F2EE] hover:text-[#141413] cursor-pointer"
                  aria-label="Close install instructions"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#34332F] bg-[#FAF9F6] border border-[#E6E4DD] rounded-xl p-4">
                {isIOS ? (
                  <>
                    <p>
                      <strong className="font-semibold text-[#141413]">1.</strong> Tap the{' '}
                      <strong className="font-semibold text-[#141413]">Share</strong> icon in Safari&apos;s toolbar.
                    </p>
                    <p>
                      <strong className="font-semibold text-[#141413]">2.</strong> Scroll down and choose{' '}
                      <strong className="font-semibold text-[#141413]">Add to Home Screen</strong>.
                    </p>
                    <p>
                      <strong className="font-semibold text-[#141413]">3.</strong> Tap{' '}
                      <strong className="font-semibold text-[#141413]">Add</strong> to launch Stack House like a native app.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong className="font-semibold text-[#141413]">Desktop (Chrome / Edge):</strong> Open the browser menu or click the install icon in the address bar and select{' '}
                      <strong className="font-semibold text-[#141413]">Install Stack House</strong>.
                    </p>
                    <p>
                      <strong className="font-semibold text-[#141413]">Android / iPhone:</strong> Open in Safari or Chrome and select{' '}
                      <strong className="font-semibold text-[#141413]">Add to Home Screen</strong>.
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-[#141413] text-white text-sm font-semibold hover:bg-[#2A2927] transition-colors cursor-pointer"
                type="button"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
