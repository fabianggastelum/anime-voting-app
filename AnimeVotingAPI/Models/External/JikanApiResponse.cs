using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Models.External
{
    public class JikanApiResponse
    {
        [JsonPropertyName("data")]
        public JikanCharacter[] Data { get; set; } = Array.Empty<JikanCharacter>();
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;
    }
}
