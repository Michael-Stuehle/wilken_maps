using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

public class Builder
{
    public static void BuildWebGl()
    {
        BuildPipeline.BuildPlayer(
             new[] { "Assets/Scenes/SampleScene.unity", "Assets/Scenes/Death_Scene.unity" },
             "Build/WebGl/",
             BuildTarget.WebGL,
             BuildOptions.None);
    }
}

