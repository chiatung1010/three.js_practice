let scene, renderer, camera
let cameraControl
let statsUI

class Role {
    constructor() {
      // 宣告頭、身體、腳幾何體大小
      const headGeo = new THREE.IcosahedronGeometry(2, 2); // 多面體
      const bodyGeo = new THREE.BoxGeometry(2, 8, 2)
      const handGeo = new THREE.BoxGeometry(2, 2, 2)
      const footGeo = new THREE.BoxGeometry(2, 5, 2)
  
      // 馮氏材質設置
      const roleMat = new THREE.MeshPhongMaterial({ color: 0x8ccdf3, specular: 0x6e6e6e })

      // 頭
      this.head = new THREE.Mesh(headGeo, roleMat)
      this.head.position.set(0, 6, 0)
  
      // 身體
      this.body = new THREE.Mesh(bodyGeo, roleMat)
      this.body.position.set(0, 0, 0)
  
      // 手
      this.hand1 = new THREE.Mesh(handGeo, roleMat)
      this.hand1.position.set(0, 2.5, 2.5)
      this.hand2 = this.hand1.clone()
      this.hand2.position.set(0, 2.5, -2.5)

      // 腳
      this.foot1 = new THREE.Mesh(footGeo, roleMat)
      this.foot1.position.set(0, -5, 2.5)
      this.foot2 = this.foot1.clone()
      this.foot2.position.set(0, -5, -2.5)
  
      // 將兩隻手組合為一個 group
      this.hand = new THREE.Group()
      this.hand.add(this.hand1)
      this.hand.add(this.hand2)

      // 將兩隻腳組合為一個 group
      this.feet = new THREE.Group()
      this.feet.add(this.foot1)
      this.feet.add(this.foot2)

      // 將頭、身體、手、腳組合為一個 group
      this.role = new THREE.Group()
      this.role.add(this.head)
      this.role.add(this.body)
      this.role.add(this.hand)
      this.role.add(this.feet)
    }
}

// 生成腳色並加到場景
function createRole() {
    const roleObj = new Role()
    scene.add(roleObj.role)
}

// 初始化場景、渲染器、相機、物體
function init() {
    // 建立場景
    scene = new THREE.Scene()

    // 建立渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
    renderer.setClearColor(0xeeeeee, 1.0) // 設定背景顏色
    renderer.shadowMap.enable = true // 陰影效果

    // 將渲染器的 DOM 綁到網頁上
    document.body.appendChild(renderer.domElement)

    // 建立相機
    camera = new THREE.PerspectiveCamera( // 透視投影相機
        // 視角, 畫面寬高比, 近面距離(near), 遠面距離(far)
        60, window.innerWidth / window.innerHeight, 0.1, 1000
    )
    camera.position.set(30, 30, 30) // 相機位置
    camera.lookAt(scene.position) // 相機焦點 // 固定位置


    // 建立 OrbitControls 相機軌道控制器
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControl.update();
    cameraControl.enableDamping = true // 啟用阻尼效果 // 阻尼：拖移旋轉時的「滑鼠靈敏度」
    cameraControl.dampingFactor = 0.25 // 阻尼系數

    // 設置平行光 DirectionalLight
    let directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(-10, 20, 20)
    directionalLight.castShadow = true
    scene.add(directionalLight)
    let directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight
    )
    scene.add(directionalLightHelper)

    let axes = new THREE.AxesHelper(20) // 參數為座標軸長度
    scene.add(axes)

    createRole()

    // 簡單的地板
    const planeGeometry = new THREE.PlaneGeometry(60, 60)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    plane.position.set(0, -7, 0)
    scene.add(plane)

    // 監測器初始化
    statsUI = initStats() 
}

// 建立監測器
function initStats() {
  const stats = new Stats()
  stats.setMode(0) // FPS mode
  document.getElementById('stats').appendChild(stats.domElement)
  return stats
}


// 渲染場景
function render() {
    requestAnimationFrame(render) // 讓場景中的物體動起來，就需要處理「每隔一段時間重新渲染場景」的工作

    cameraControl.update()

    statsUI.update() // 需設定 update 才會持續更新
    
    renderer.render(scene, camera)
}

// 監聽螢幕寬高來做簡單 RWD 設定
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

init()
render()
