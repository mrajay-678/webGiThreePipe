import { ThreeViewer, LoadingScreenPlugin, GBufferPlugin, SSAAPlugin, SSAOPlugin } from "threepipe";
import { BloomPlugin, SSReflectionPlugin, TemporalAAPlugin, DepthOfFieldPlugin } from "@threepipe/webgi-plugins";

let viewer, ringMesh;

async function init() {
  viewer = new ThreeViewer({
    canvas: document.getElementById("webgi-canvas"),
    renderScale: "auto",
    msaa: true,
    plugins: [LoadingScreenPlugin, GBufferPlugin, BloomPlugin, SSAAPlugin, SSAOPlugin, SSReflectionPlugin, TemporalAAPlugin, DepthOfFieldPlugin],
  });

  await viewer.load("./scene.glb");


  // Find your ring mesh by name in the GLB
  let matches = [];
  if (typeof viewer.scene.findObjectsByName === 'function') {
    matches = viewer.scene.findObjectsByName("mesh_1");
  }
  if (!matches || matches.length === 0) {
    // Fallback: traverse the scene and log all mesh names
    viewer.scene.traverse(obj => {
      if (obj.isMesh && obj.name && obj.name === 'Brillant_1') {
        matches.push(obj);
      }
    });
    // Log all mesh names for debugging
    console.log('All mesh names in scene:');
    viewer.scene.traverse(obj => {
      if (obj.isMesh && obj.name) console.log(obj.name);
    });
  }
  if (matches.length > 0) {
    ringMesh = matches[0];
    console.log("Ring Mesh Found:", ringMesh);
  } else {
    console.warn("No object named 'Ring' found in scene.glb");
  }

  const taa = viewer.getPlugin(TemporalAAPlugin);
  taa.enabled = true;
  if (taa.feedBack && typeof taa.feedBack.set === 'function') {
    taa.feedBack.set(0.88, 0.97);
  } else if (taa.feedback && typeof taa.feedback.set === 'function') {
    taa.feedback.set(0.88, 0.97);
  } else {
    // fallback: try to set properties directly if available
    if (taa.feedBack0 !== undefined) taa.feedBack0 = 0.88;
    if (taa.feedBack1 !== undefined) taa.feedBack1 = 0.97;
  }
}

function changeMetal(colorHex) {
  if (!ringMesh) return;

  // If it's a group, apply to all meshes inside
  ringMesh.traverse((child) => {
    if (child.isMesh && child.material) {
      if (child.material.color) child.material.color.setHex(colorHex);
      child.material.metalness = 1;
      child.material.roughness = 0.2;
    }
  });

  viewer.setDirty(); // Refresh render
}


// Hook buttons
document.addEventListener("DOMContentLoaded", () => {
  init();

  document.getElementById("gold-btn").addEventListener("click", () => changeMetal(0xffd700));
  document.getElementById("silver-btn").addEventListener("click", () => changeMetal(0xc0c0c0));
  document.getElementById("rose-btn").addEventListener("click", () => changeMetal(0xb76e79));
});


// All mesh names in scene:
// script.js:32 mesh_0
// script.js:32 mesh_1
// script.js:32 Brillant_1