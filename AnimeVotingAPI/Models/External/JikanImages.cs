using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Models.External
{
    public class JikanImages
    {
        [JsonPropertyName("jpg")]
        public JikanCharacterImage Jpg { get; set; } = new JikanCharacterImage();
        [JsonPropertyName("webp")]
        public JikanCharacterImage Webp { get; set; } = new JikanCharacterImage();
    }
}
