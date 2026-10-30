
/**
 * Imports
 */ 
import * as THREE from 'three'; 
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import gui from 'lil-gui'
import { texture } from 'three/src/nodes/accessors/TextureNode.js';




//Canvas 
const canvas = document.querySelector('canvas.webgl'); 

//Scene
const scene = new THREE.Scene(); 


//Texture Loader

const textureLoader = new THREE.TextureLoader()

// AmbientLight

const ambientLight = new THREE.AmbientLight(0xffffff , 0.3)
scene.add(ambientLight)


const star1 = textureLoader.load('/particles/star_soft_white_256 (2).webp', (texture)=>{
  console.log('Loaded ' , texture.image.width)
}, undefined , (err)=>{
  console.log('error !' , err)
})
console.log(star1)
star1.colorSpace = THREE.SRGBColorSpace


// SaturnTexture

const saturnTextureAlpha = textureLoader.load('/saturn/SaturnAlpha.webp')
const saturnTextureColor = textureLoader.load('/saturn/SaturnBaseColor.webp')
const saturnTextureNormal = textureLoader.load('/saturn/SaturnNormal.webp')
const saturnTextureRoughness = textureLoader.load('/saturn/SaturnRoughness.webp')
const saturnTextureMetalness = textureLoader.load('/saturn/SaturnMetalness.webp')
const saturnTextureAmbientOcclusion = textureLoader.load('/saturn/SaturnAO.webp');
const saturnTextureBump = textureLoader.load('/saturn/SaturnBump.webp')
saturnTextureColor.colorSpace = THREE.SRGBColorSpace


//Atmosphere texture

const saturnAtmosphereTextureAlpha = textureLoader.load('/saturn/SaturnAtmosphereAlpha.webp')
const saturnAtmosphereTextureCloud = textureLoader.load('/saturn/SaturnAtmosphereBaseColor.webp')
const saturnAtmosphereTextureRGBA = textureLoader.load('/saturn/SaturnAtmosphereRGBA.webp')
saturnAtmosphereTextureCloud.colorSpace = THREE.SRGBColorSpace
saturnAtmosphereTextureRGBA.colorSpace = THREE.SRGBColorSpace

//RingTextures

const ringTextureBaseColor =textureLoader.load('/saturn/SaturnRingsBaseColor.webp')
const ringTextureRGBA = textureLoader.load('/saturn/SaturnRingsRGBA.webp')
const ringTextureRoughness = textureLoader.load('/saturn/SaturnRingsRoughness.webp')
const ringTextureAlpha = textureLoader.load('/saturn/SaturnRingsAlpha.webp')
ringTextureRGBA.colorSpace = THREE.SRGBColorSpace


// ====================================
// BLACK HOLE TEXTURES
// ====================================

// Disk
const blackHoleDiskAlpha = textureLoader.load('/blackhole/BlackHoleDiskAlpha.webp')
const blackHoleDiskBaseColor = textureLoader.load('/blackhole/BlackHoleDiskBaseColor.webp')
const blackHoleDiskDensity = textureLoader.load('/blackhole/BlackHoleDiskDensity.webp')
const blackHoleDiskRGBA = textureLoader.load('/blackhole/BlackHoleDiskRGBA.webp')
const blackHoleDiskTurbulence = textureLoader.load('/blackhole/BlackHoleDiskTurbulence.webp')

// Filaments
const blackHoleFilamentsAlpha = textureLoader.load('/blackhole/BlackHoleFilamentsAlpha.webp')
const blackHoleFilamentsColor = textureLoader.load('/blackhole/BlackHoleFilamentsColor.webp')
const blackHoleFilamentsRGBA = textureLoader.load('/blackhole/BlackHoleFilamentsRGBA.webp')

// Halo
const blackHoleHaloAlpha = textureLoader.load('/blackhole/BlackHoleHaloAlpha.webp')
const blackHoleHaloColor = textureLoader.load('/blackhole/BlackHoleHaloColor.webp')
const blackHoleHaloRGBA = textureLoader.load('/blackhole/BlackHoleHaloRGBA.webp')

// Lensing Arc
const blackHoleLensingArcAlpha = textureLoader.load('/blackhole/BlackHoleLensingArcAlpha.webp')
const blackHoleLensingArcColor = textureLoader.load('/blackhole/BlackHoleLensingArcColor.webp')
const blackHoleLensingArcRGBA = textureLoader.load('/blackhole/BlackHoleLensingArcRGBA.webp')

// Photon Edge
const blackHolePhotonEdgeAlpha = textureLoader.load('/blackhole/BlackHolePhotonEdgeAlpha.webp')
const blackHolePhotonEdgeColor = textureLoader.load('/blackhole/BlackHolePhotonEdgeColor.webp')
const blackHolePhotonEdgeRGBA = textureLoader.load('/blackhole/BlackHolePhotonEdgeRGBA.webp')

const colorTextures = [
  blackHoleDiskBaseColor,
  blackHoleDiskRGBA,
  blackHoleFilamentsColor,
  blackHoleFilamentsRGBA,
  blackHoleHaloColor,
  blackHoleHaloRGBA,
  blackHoleLensingArcColor,
  blackHoleLensingArcRGBA,
  blackHolePhotonEdgeColor,
  blackHolePhotonEdgeRGBA, 
]

colorTextures.forEach(texture => {
  texture.colorSpace = THREE.SRGBColorSpace
})



//sizes

const sizes = {
  width: window.innerWidth,
  height : window.innerHeight
}

// Particles

const starsParticlesGeometry = new THREE.BufferGeometry(); 

const randomStarsPositions = new Float32Array(10000)

for(let i =0; i<10000; i++){
  randomStarsPositions[i] = (Math.random() - 0.5) *10
}

starsParticlesGeometry.setAttribute('position' , new THREE.BufferAttribute(randomStarsPositions , 3))

const starsMaterial = new THREE.PointsMaterial({
  
  size: 15,
  map: star1,
  sizeAttenuation: false,
  transparent: true, 
  alphaTest: 0.01, 
  depthWrite: false,

}); 

starsMaterial.map = star1

const stars = new THREE.Points(starsParticlesGeometry , starsMaterial)
scene.add(stars)



//Resizing 

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Saturn SaturnGroup
const saturnGroup = new THREE.Group(); 
scene.add(saturnGroup); 

const saturn = new THREE.Mesh(
  new THREE.SphereGeometry(0.5 , 32 ,32),
  new THREE.MeshStandardMaterial({
    map: saturnTextureColor,
    transparent: true,
    alphaMap: saturnTextureAlpha,
    normalMap: saturnTextureNormal,
    roughnessMap: saturnTextureRoughness,
    metalnessMap: saturnTextureMetalness,
    aoMap: saturnTextureAmbientOcclusion,
    bumpMap: saturnTextureBump,
  })
)

saturn.position.z = 0.67
saturn.position.x = -1.5
saturnGroup.add(saturn)


// Saturn Atmosphere

// const saturnAtmosphere = textureLoader.load('/saturn/SaturnAtmosphereRGBA.webp')
// saturnAtmosphere.colorSpace = THREE.SRGBColorSpace

const atmosphereMaterial = new THREE.SpriteMaterial({
  map: saturnAtmosphereTextureRGBA, 
  color: '#FAE5BF ',
  transparent: true, 
  opacity: 0.7,
  depthWrite: false, 
  depthTest: true,
  
})

const atmosphere = new THREE.Sprite(atmosphereMaterial)
atmosphere.position.set(-0.05,0,0)

atmosphere.scale.set(2,2,1)
saturn.add(atmosphere)



// RingGeo 

const saturnRingMesh = new THREE.Mesh(

  new THREE.RingGeometry(0.8 , 2.6 , 128, 4 , 3, Math.PI *2),
  // new THREE.PlaneGeometry(3.6, 3.6),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: ringTextureRGBA,
    side: THREE.DoubleSide, 
    depthWrite: false,
    roughnessMap: ringTextureRoughness,
    
  }
  )
)

saturnRingMesh.rotation.x = Math.PI * 0.6
saturnRingMesh.position.x = -1.5
saturnRingMesh.position.z = 0.7
saturnRingMesh.rotation.z = Math.PI * 0.6
saturnRingMesh.rotation.y = Math.PI * -0.09

saturnGroup.add(saturnRingMesh)

//Camera

const camera = new THREE.PerspectiveCamera(75 , sizes.width / sizes.height , 0.1 , 100); 
camera.position.z = 3
camera.fov= 45
camera.updateProjectionMatrix()
scene.add(camera)




// BlackHole 


const blackHoleGroup = new THREE.Group(); 


scene.add(blackHoleGroup); 

const blackHole = new THREE.Mesh(
  new THREE.SphereGeometry(0.7 , 64 ,64),
  new THREE.MeshBasicMaterial({
    color: 0x000000, 
    transparent: false,
    depthWrite: true,
    depthTest: true
    
  })
)

blackHole.position.z = -6
blackHole.position.x = 3.5
blackHoleGroup.add(blackHole)




// BLACKHOLE RING [DISK] 
const blackHoleDiskGeometry =   new THREE.PlaneGeometry(3.6, 3.6)

const gasGeometry =  new THREE.MeshBasicMaterial({
    transparent: true,
    map: blackHoleDiskRGBA,
    side: THREE.DoubleSide, 
    depthWrite: false,
    alphaTest: 0.01
  }
  )

const filamentsMaterial =  new THREE.MeshBasicMaterial({
    map: blackHoleFilamentsRGBA, 
    transparent: true,
    blending: THREE.AdditiveBlending, 
    side: THREE.DoubleSide,
    opacity: 0.55,
  })

  const filaments= new THREE.Mesh(
    blackHoleDiskGeometry , filamentsMaterial 
  )
  const gasDisk = new THREE.Mesh(blackHoleDiskGeometry , gasGeometry)

  const gasGroup = new THREE.Group()

  gasGroup.add(gasDisk , filaments)

  gasGroup.rotation.x = Math.PI *0.55
  gasGroup.position.x = 3.4
  gasGroup.position.z = -6

  blackHoleGroup.add(gasGroup)
// blackHoleRing.position.x = 3.5
// blackHoleRing.rotation.x = Math.PI * 0.54
// blackHoleRing.position.z = -6
// blackHoleGroup.add()


// PhotonEdge

const photonEdge = new THREE.Mesh(
  new THREE.PlaneGeometry(3.9, 3.9),
  new THREE.MeshBasicMaterial({
      map: blackHolePhotonEdgeRGBA,
      transparent: true, 
      side :THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1
  })
)

photonEdge.position.set(3.5,0.01,-6)

blackHoleGroup.add(photonEdge)


//BlackHole Halo [Atmosphere]

const haloMaterial = new THREE.SpriteMaterial({
  map : blackHoleHaloRGBA, 
  transparent: true,
  opacity: 0.65,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  depthTest: true
})

const halo = new THREE.Sprite(haloMaterial)
halo.scale.set(4,4,1)
halo.position.set(3.5 , 0.01 , -6)
blackHoleGroup.add(halo)

//lens

const lensingMaterial = new THREE.SpriteMaterial({
  map: blackHoleLensingArcRGBA,
  opacity: 0.8,
  depthWrite: false,
  depthTest: true,
  blending: THREE.AdditiveBlending
})

const lensingArc = new THREE.Sprite(lensingMaterial); 

lensingArc.scale.set(3.5,3.4,1)
lensingArc.position.set(3.53,0.02,-6)
blackHoleGroup.add(lensingArc)


// Control

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true; 
controls.maxDistance = 6
controls.minDistance = 1
controls.enablePan = false

saturnGroup.position.z = -2.4

//Rendre

const renderer = new THREE.WebGLRenderer({canvas:canvas} )
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))




// Tick

const clock = new THREE.Clock()

const tick = ()=>{
      
    const elapsedTime = clock.getElapsedTime()

      // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


}

tick()