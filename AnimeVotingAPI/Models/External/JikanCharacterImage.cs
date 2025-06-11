using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Models.External
{
    public class JikanCharacterImage
    {
        //The main image URL, maps to "image_url" in the JSON response of the Jikan API.
        [JsonPropertyName("image_url")]
        public string ImageUrl { get; set; } = string.Empty;

        [JsonPropertyName("small_image_url")]
        public string? SmallImageUrl { get; set; }
    }
}
