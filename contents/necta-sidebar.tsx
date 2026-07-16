import { useState, useCallback, useEffect } from "react"
import type { PlasmoCSConfig } from "plasmo"
import NectaSidebar from "../components/necta/NectaSidebar"
import styleText from "data-text:../style.css"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getShadowHostId = () => "necta-sidebar-host"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const NectaSidebarWrapper = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (msg: any, _sender: any, sendResponse: any) => {
      if (msg.type === "NECTA_TOGGLE") {
        setVisible((v) => !v)
        sendResponse({ visible: !visible })
      }
      if (msg.type === "NECTA_GET_STATE") {
        sendResponse({ visible })
      }
    }
    chrome.runtime.onMessage.addListener(handler)
    return () => chrome.runtime.onMessage.removeListener(handler)
  }, [visible])

  if (!visible) return null

  return (
    <div
      id="necta-sidebar"
      className="fixed top-0 right-0 h-full overflow-hidden"
      style={{
        width: 360,
        fontFamily: "Inter, system-ui, sans-serif",
        zIndex: 2147483647
      }}
    >
      <NectaSidebar />
    </div>
  )
}

export default NectaSidebarWrapper
