using AnimeVotingAPI.Models.External;

namespace AnimeVotingAPI.Services
{
    public interface IJikanService
    {
        Task<JikanCharacter[]> GetCharactersAsync(int animeId);
        Task<string?> GetAnimeTitleAsync(int animeId);
    }
}
