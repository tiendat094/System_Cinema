using AutoMapper;
using MovieService.Manager.Cinemas;
using MovieService.Manager.Cinemas.Dto;
using MovieService.Manager.Genres.Dto;
using MovieService.Manager.Movies.Dto;
using MovieService.Manager.Rooms.Dto;
using MovieService.Manager.Seats.Dto;
using MovieService.Model;

namespace MovieService
{
    public class MappingProfile : Profile
    {
        public MappingProfile() { 
            CreateMap<Movie, CreateOrUpdateMovieDto>();
            CreateMap<CreateOrUpdateMovieDto, Movie>();
            CreateMap<ShowTime, ShowTimeDto>();
            CreateMap<GenerDto, Genre>();
            CreateMap<Genre, GenerDto>();
            CreateMap<SeatDto, SeatDto>();
            CreateMap<SeatDto, SeatDto>();
            CreateMap<RoomDto, Room>();
            CreateMap<Room, RoomDto>();
        }
    }
}
