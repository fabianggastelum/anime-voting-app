using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Models.External
{
    public class JikanCharacter
    {
        //The ID for the character on MyAnimeList (MAL). 
        [JsonPropertyName("mal_id")]
        public int MalId { get; set; }
        //The name of the character.
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        // The name of the anime form where the character is. 
        [JsonPropertyName("anime")]
        public string Anime {  get; set; } = string.Empty ;
        //The character's URL on MyAnimeList (MAL).
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;
        //The character's images (JPG).
        [JsonPropertyName("images")]
        public JikanImages Images { get; set; } = new JikanImages();
    }
}
