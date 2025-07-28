import {ThreeViewer, timeout, LoadingScreenPlugin, GBufferPlugin, BaseGroundPlugin, SSAAPlugin, PickingPlugin, SSAOPlugin} from 'threepipe';
import {BloomPlugin, SSReflectionPlugin, TemporalAAPlugin, DepthOfFieldPlugin} from '@threepipe/webgi-plugins';

async function init() {
    const viewer = new ThreeViewer({
        canvas: document.getElementById('webgi-canvas'),
        renderScale: 'auto',
        msaa: true,
        plugins: [
            LoadingScreenPlugin, 
            GBufferPlugin, 
            BloomPlugin,
            SSAAPlugin,
            SSAOPlugin,
            SSReflectionPlugin, 
            TemporalAAPlugin,
            DepthOfFieldPlugin,
        ],
    });
    await viewer.load('./scene.glb');

    // Plugin configurations after viewer is ready
    const ssrefl = viewer.getPlugin(SSReflectionPlugin)
    ssrefl.enabled = true
    ssrefl.intensity = 1
    ssrefl.objectRadius = 0.001
    ssrefl.tolerance = 0.8

    const ssao = viewer.getPlugin(SSAOPlugin)
    ssao.enabled = true
    ssao.intensity = 0.5
    ssao.bias = 0.001
    ssao.falloff = 1.25
    ssao.numSamples = 8

    const ssaa = viewer.getPlugin(SSAAPlugin)
    ssaa.enabled = true
    ssaa.rendersPerFrame = 2
    ssaa.jitterRenderCamera = true

    const taa = viewer.getPlugin(TemporalAAPlugin)
    taa.enabled = true
    taa.feedBack.set(0.88, 0.97)
}
init()