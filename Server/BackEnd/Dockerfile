﻿FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["back-end/back-end.csproj", "back-end/"]
RUN dotnet restore "back-end/back-end.csproj"
COPY . .
WORKDIR "/src/back-end"
RUN dotnet build "back-end.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "back-end.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "back-end.dll"]
