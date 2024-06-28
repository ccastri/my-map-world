"use client"
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
interface ApiResponse {
  // Define aquí la estructura de tu respuesta
  message: string;
}

export default function Home() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
const geoUrl ="/ne_10m_admin_0_countries.json"
const markers = [
  {
    markerOffset: -15,
    name: "Buenos Aires",
    coordinates: [-58.3816, -34.6037]
  },
  { markerOffset: -15, name: "La Paz", coordinates: [-68.1193, -16.4897] },
  { markerOffset: 25, name: "Brasilia", coordinates: [-47.8825, -15.7942] },
  { markerOffset: 25, name: "Santiago", coordinates: [-70.6693, -33.4489] },
  { markerOffset: 25, name: "Bogota", coordinates: [-74.0721, 4.711] },
  { markerOffset: 25, name: "Quito", coordinates: [-78.4678, -0.1807] },
  { markerOffset: -15, name: "Georgetown", coordinates: [-58.1551, 6.8013] },
  { markerOffset: -15, name: "Asuncion", coordinates: [-57.5759, -25.2637] },
  { markerOffset: 25, name: "Paramaribo", coordinates: [-55.2038, 5.852] },
  { markerOffset: 25, name: "Montevideo", coordinates: [-56.1645, -34.9011] },
  { markerOffset: -15, name: "Caracas", coordinates: [-66.9036, 10.4806] },
  { markerOffset: -15, name: "Lima", coordinates: [-77.0428, -12.0464] }
];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('http://localhost/api/healthcheck');
        setData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
        } else {
          setError(new Error("An unexpected error occurred") as AxiosError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex min-h-screen border-2 border-red-500 flex-col items-center justify-between p-24">
      <div className="w-screen h-screen">
      <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {markers.map(({ name, coordinates, markerOffset }) => (
  <Marker 
  key={name} 
  coordinates={coordinates as [number, number]}
  onMouseEnter={() => setHoveredMarker(name)}
  onMouseLeave={() => setHoveredMarker(null)}
  onClick={() => setSelectedMarker(name)}
>
  <circle r={6} fill={hoveredMarker === name ? "#00F" : "#F00"} stroke="#fff" strokeWidth={2} />
  <text
    textAnchor="middle"
    y={markerOffset}
    style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
  >
    {name}
  </text>
</Marker>
))}
    </ComposableMap>

      </div>
      {selectedMarker && (
        <div className="marker-info">
          <p>Selected Marker: {selectedMarker}</p>
          {/* Aquí puedes agregar más información o componentes adicionales según sea necesario */}
        </div>
      )}
    </main>
  );
}
