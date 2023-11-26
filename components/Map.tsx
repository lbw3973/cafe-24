"use client";
import { useGetImages } from "@/hooks/useGetImages";
import { useImageStore } from "@/store/imageStore";
import { useSelectedStore } from "@/store/selectedStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { IMarkerInfo } from "@/types/Map";
import { GetStoreInfo, getStoreImages } from "@/utils/firebase";
import { useEffect, useRef } from "react";
import { IoMdRefresh } from "react-icons/io";
import "@/styles/marker.css";

const Map = () => {
  const mapRef = useRef<any | null>(null);
  const markerRef = useRef<IMarkerInfo[]>([]);
  const { setOpen } = useSidebarStore();
  const { setData } = useSelectedStore();
  const { setUrl, resetUrl } = useImageStore();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = async () => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
    };

    if (mapRef.current === null) {
      mapRef.current = new window.naver.maps.Map("map", mapOptions);
    }

    setMarker();
  };

  const setMarker = async () => {
    markerRef.current.map(marker => marker.setMap(null));
    const storeInfo = await GetStoreInfo();

    const boundsStores = storeInfo.filter(store => {
      return (
        store.latitude < mapRef.current.getBounds()._max._lat && store.latitude > mapRef.current.getBounds()._min._lat
      );
    });
    // TODO: 전체,무인,일반 선택했을때의 필터 추가
    boundsStores.map(data => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(data.latitude, data.longitude),
        map: mapRef.current,
        icon: {
          content: `
          <div class="marker-container">
          ${data.name}
            <div class="marker-arrow-border"></div>
            <div class="marker-arrow"></div>
          </div>`,
          size: new window.naver.maps.Size(128, 40),
          anchor: new window.naver.maps.Point(32, 32),
        },
        data: data,
      });
      markerRef.current.push(marker);
    });
    markerRef.current.map(marker => {
      window.naver.maps.Event.addListener(marker, "click", async () => {
        resetUrl();
        setData(marker.data);
        setOpen();
        const image = await getStoreImages(marker.data.id);
        setUrl(image as string[]);
      });
    });
  };

  return (
    <div>
      <div id="map" className="w-screen h-screen"></div>
      <button
        onClick={setMarker}
        className="flex justify-center items-center gap-2 absolute w-48 h-7 top-28 left-1/2 transform -translate-x-1/2 z-50 bg-white text-l rounded-3xl border border-mainColor text-mainColor"
      >
        <IoMdRefresh />현 지도에서 검색
      </button>
    </div>
  );
};

export default Map;
