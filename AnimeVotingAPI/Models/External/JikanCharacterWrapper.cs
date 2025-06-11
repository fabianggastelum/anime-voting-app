using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Models.External
{
    public class JikanCharacterWrapper
    {
        [JsonPropertyName("character")]
        public JikanCharacter Character { get; set; } = new JikanCharacter();
    }

    public class JikanCharacterResponse
    {
        [JsonPropertyName("data")]
        public List<JikanCharacterWrapper> Data { get; set; } = new();
    }
}

