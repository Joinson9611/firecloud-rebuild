export default function MapLoader () {   // <-- 原作者这里使用的是module.exports
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'http://webapi.amap.com/maps?v=1.4.14&callback=initAMap&key=21d2805b1b3b94b2c35975460006531f'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}

/*export default function MapLoader () {   // <-- 原作者这里使用的是module.exports
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      const script = document.createElement('script')
      // script.type = 'text/javascript'
      script.async = true
      script.src = 'https://webapi.amap.com/maps?v=1.4.14&key=21d2805b1b3b94b2c35975460006531f&callback=initAMap'
      script.charset = 'utf-8'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}*/
