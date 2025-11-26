"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ServerItem {
    id: string | null;
    href: string | null;
    title: string | null;
    name: string;
}
interface SourceData {
    type: string;
    link: string;

}
export default function PlayerPage(id: string) {
    const searchParams = useSearchParams();
    const movieId = searchParams.get("movieId");
    const episodeId = searchParams.get("episodeId");
    const [servers, setServers] = useState<ServerItem[]>([]);
    const [source, setSource] = useState<SourceData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (movieId) {
                try {
                    const res = await fetch(`/api/episode?id=${movieId}`)


                    const json = await res.json();  // fetch returns JSON
                    const html = json.data; // contains full HTML

                    // Parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    // Select all <a> tags with data-linkid
                    const linkNodes = doc.querySelectorAll("a[data-linkid]");

                    const serverList = Array.from(linkNodes).map(a => ({
                        id: a.getAttribute("data-linkid"),
                        href: a.getAttribute("href"),
                        title: a.getAttribute("title"),
                        name: a.querySelector("span")?.textContent?.trim() ?? "Unknown"
                    }));

                    console.log("Parsed Servers => ", serverList);
                    setServers(serverList);
                    getSource(serverList[0].id ?? "")

                } catch (error) {
                    console.error("API Error:::::::::::::", error);
                }
            }
            else {
                try {
                    const res = await fetch(`/api/server?id=${episodeId}`)


                    const json = await res.json();  // fetch returns JSON
                    const html = json.data; // contains full HTML

                    // Parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, "text/html");

                    // Select all <a> tags with data-linkid
                    const linkNodes = doc.querySelectorAll("a[data-id]");

                    const serverList = Array.from(linkNodes).map(a => ({
                        id: a.getAttribute("data-id"),
                        href: a.getAttribute("href"),
                        title: a.getAttribute("title"),
                        name: a.querySelector("span")?.textContent?.trim() ?? "Unknown"
                    }));

                    console.log("Parsed Servers => ", serverList);
                    setServers(serverList);
                    getSource(serverList[0].id ?? "")

                } catch (error) {
                    console.error("API Error:::::::::::::", error);
                }
            }
        }

        loadData();
    }, []);

    async function getSource(id: string) {
        try {
            const res = await fetch(`/api/sources?id=${id}`);
            const json = await res.json();
            setSource(json);
        } catch (err) {
            console.error("Source Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            {/* Loader */}
            {loading || !source?.link ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading.</p>
                    </div>
                </div>
            ) : (
                /* Show iframe after loading */
                <div className="w-full h-screen bg-black flex items-center justify-center">

                    <iframe id="iframe-embed" width="100%" height="100%" scrolling="no" src={source?.link} ></iframe>
                </div>

            )}
        </div>
    );

}
