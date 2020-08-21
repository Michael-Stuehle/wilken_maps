using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Video;
using Assets.Scripts.Helper;

public class RespawnScript : MonoBehaviour
{
    // Start is called before the first frame update
    void Awake()
    {
        VideoPlayer v = GetComponent<VideoPlayer>();
        v.loopPointReached += EndReached;
        v.source = VideoSource.Url;
        v.url = Application.streamingAssetsPath + "/death_screen.mp4";
        v.Play();
    }

    void EndReached(UnityEngine.Video.VideoPlayer vp)
    {
        SceneManager.UnloadSceneAsync(Constants.DEATH_SCENE);
        SceneManager.LoadScene(Constants.GAME_SCENE);
    }

}
