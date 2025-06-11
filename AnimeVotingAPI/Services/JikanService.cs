using AnimeVotingAPI.Models.External;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AnimeVotingAPI.Services
{
    public class JikanService : IJikanService
    {
        //Injected HttpClient to send HTTP requests.
        private readonly HttpClient _httpClient;
        // Constructor that accepts the injected HttpClient instance.
        public JikanService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Inherited method from the IJikanService interface.
        // Builds the URL to get characters for the anime with the specified ID
        public async Task<JikanCharacter[]> GetCharactersAsync(int animeId)
        {
            var url = $"https://api.jikan.moe/v4/anime/{animeId}/characters";
            var response = await _httpClient.GetAsync(url);
            if (!response.IsSuccessStatusCode){
                return Array.Empty<JikanCharacter>();
            }

            var json = await response.Content.ReadAsStringAsync();
            //Jikan API response wraps data inside a "data" property
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            var result = JsonSerializer.Deserialize<JikanCharacterResponse> (json, options);

            return result?.Data
                .Where(w => w.Character != null)
                .Select(w => w.Character)
                .ToArray() ?? Array.Empty<JikanCharacter>();

        }

        public async Task<string?> GetAnimeTitleAsync(int animeId)
        {
            var response = await _httpClient.GetAsync($"https://api.jikan.moe/v4/anime/{animeId}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var anime = JsonSerializer.Deserialize<JikanAnimeResponseWrapper>(json);
            return anime?.Data?.Title;
        }
        private class JikanAnimeResponseWrapper
        {
            [JsonPropertyName("data")]
            public JikanApiResponse? Data { get; set; }
        }

    }
}
