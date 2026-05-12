FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ../Ofiador.API/Ofiador.API.csproj Ofiador.API/
COPY ../Ofiador.Application/Ofiador.Application.csproj Ofiador.Application/
COPY ../Ofiador.Domain/Ofiador.Domain.csproj Ofiador.Domain/
COPY ../Ofiador.Infrastructure/Ofiador.Infrastructure.csproj Ofiador.Infrastructure/

COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Ofiador.API.dll"]