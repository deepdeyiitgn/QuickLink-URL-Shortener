// src/components/CopyrightPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

const CopyrightPage: React.FC = () => {
  // State to manage modal visibility and content
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    embedSrc: '',
    externalLink: '',
    title: '',
    type: 'youtube', // 'youtube', 'spotify-track', 'spotify-album'
  });

  // Ref for the modal to close it by clicking outside
  const modalRef = useRef<HTMLDivElement>(null);
  // Ref for the iframe to stop playback on close
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to open the modal
  const openModal = (
    embedSrc: string,
    externalLink: string,
    title: string,
    type: string
  ) => {
    setModalData({ embedSrc, externalLink, title, type });
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Stop video/music from playing in the background
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
  };

  // Effect to handle global event listeners (keyboard shortcuts, context menu)
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
        (e.ctrlKey && (e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove listeners when component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array means this runs once on mount

  // Effect to handle closing modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        e.target === modalRef.current
      ) {
        closeModal();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [modalRef]); // Re-run if modalRef changes

  // Handle image loading errors
  const onImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget;
    const placeholder = target.alt.includes('Playlist')
      ? 'https://placehold.co/1280x720/1f2937/9ca3af?text=Playlist+Art+Not+Found'
      : 'https://placehold.co/500x500/1f2937/9ca3af?text=Art+Not+Found';
    target.src = placeholder;
    target.onerror = null; // Prevent infinite loop
  };

  // Determine iframe container classes
  const iframeContainerClasses = [
    'iframe-container',
    modalData.type === 'spotify-track' ? 'spotify-track' : '',
    modalData.type === 'spotify-album' ? 'spotify-album' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Copyright</h1>

      {/* Yahan niche tumhara pure HTML code paste karna */}
      <div>
        {/* I've pasted your HTML content below and converted it to JSX.
          This includes:
          1. <style> block for custom CSS.
          2. <main> content for all the music sections.
          3. <footer> content.
          4. The Modal HTML.
          5. The JavaScript for the modal has been converted to React logic above.
        */}

        {/* Global styles from your HTML <head> */}
        <style>
          {`
            /* Style for the iframe to be responsive */
            .responsive-iframe {
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              width: 100%;
              height: 100%;
              border: none;
            }
            .iframe-container {
              position: relative;
              overflow: hidden;
              width: 100%;
              padding-top: 56.25%; /* 16:9 Aspect Ratio */
            }
            /* Spotify embed is shorter */
            .iframe-container.spotify-track {
               padding-top: 152px; /* Spotify track embed height */
            }
            .iframe-container.spotify-album {
              padding-top: 380px; /* Spotify album embed height */
            }
            /* Protective styles for images */
            img {
              pointer-events: none; /* Disables default image interactions like drag */
              -webkit-user-select: none; /* Safari */
              -ms-user-select: none; /* IE 10+ */
              user-select: none; /* Standard syntax */
            }
            /* Make the whole body unselectable (applied to the component) */
            body {
              -webkit-user-select: none; /* Safari */
              -ms-user-select: none; /* IE 10+ */
              user-select: none; /* Standard syntax */
            }
        `}
        </style>

        {/* Your HTML <header> section was omitted because this component
          already provides a "Copyright" <h1> title.
        */}

        {/* Main Content Grid */}
        <main className="space-y-16">
          {/* === SECTION 1: Diwali === */}
          <section id="diwali">
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
              {/* Image */}
              <div className="md:w-1/3 md:flex-shrink-0">
                <img
                  className="w-full h-48 md:h-full object-cover"
                  src="https://pagalnew.com/coverimages/Diwali-Aditya-Bhardwaj-500-500.jpg"
                  alt="Album art for Diwali by Aditya Bhardwaj"
                  onError={onImageError}
                />
              </div>
              {/* Content */}
              <div className="p-6 md:p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-2">Diwali</h2>
                <h3 className="text-lg font-semibold text-indigo-400 mb-6">
                  Album: Diwali - Aditya 2024
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <strong>Song Name:</strong> Diwali
                  </li>
                  <li>
                    <strong>Singer(s):</strong> Aditya Bhardwaj
                  </li>
                  <li>
                    <strong>Lead Star(s):</strong> Aditya Bhardwaj, Binita
                    Budathoki, Mishan Bisht
                  </li>
                  <li>
                    <strong>Music Composer:</strong> Aditya Bhardwaj
                  </li>
                </ul>
                {/* Player Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    onClick={() =>
                      openModal(
                        'https://www.youtube.com/embed/J5LXoaIlVas',
                        'https://www.youtube.com/watch?v=J5LXoaIlVas',
                        'Play on YouTube',
                        'youtube'
                      )
                    }
                  >
                    <img
                      src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                      alt="YouTube"
                      className="w-5 h-5"
                    />
                    Play on YouTube
                  </button>
                  <button
                    className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    onClick={() =>
                      openModal(
                        'https://open.spotify.com/embed/track/4mP3U1F3FFZyfZLXbXQacy',
                        'https://open.spotify.com/track/4mP3U1F3FFZyfZLXbXQacy',
                        'Play on Spotify',
                        'spotify-track'
                      )
                    }
                  >
                    <img
                      src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                      alt="Spotify"
                      className="w-5 h-5"
                    />
                    Play on Spotify
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* === END SECTION 1 === */}

          {/* === SECTION 2: Dhadak 2 Playlist === */}
          <section id="dhadak2">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white">Dhadak 2</h2>
              <p className="mt-2 text-xl text-indigo-400 font-semibold">
                Full Movie Playlist
              </p>
              {/* Player Buttons */}
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <button
                  className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                  onClick={() =>
                    openModal(
                      'https://www.youtube.com/embed/videoseries?list=PL0Z67tlyTaWq5WaLxKOhyGF2T8Uj_Ait_',
                      'https://www.youtube.com/playlist?list=PL0Z67tlyTaWq5WaLxKOhyGF2T8Uj_Ait_',
                      'Play on YouTube',
                      'youtube'
                    )
                  }
                >
                  <img
                    src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                    alt="YouTube"
                    className="w-5 h-5"
                  />
                  Play Playlist on YouTube
                </button>
                <button
                  className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                  onClick={() =>
                    openModal(
                      'https://open.spotify.com/embed/album/3daeQ1DOD0NOHjrrzwYaIy',
                      'https://open.spotify.com/album/3daeQ1DOD0NOHjrrzwYaIy',
                      'Play on Spotify',
                      'spotify-album'
                    )
                  }
                >
                  <img
                    src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                    alt="Spotify"
                    className="w-5 h-5"
                  />
                  Play Album on Spotify
                </button>
              </div>
            </div>

            {/* Grid for Songs */}
            <div className="grid grid-cols-1 gap-12">
              {/* Song: Bas Ek Dhadak */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/bas-ek-dhadak-dhadak-2-500-500.jpg"
                    alt="Album art for Bas Ek Dhadak"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Bas Ek Dhadak
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Music Composer:</strong> Javed-Mohsin
                    </li>
                    <li>
                      <strong>Singers:</strong> Shreya Ghoshal & Jubin Nautiyal
                    </li>
                    <li>
                      <strong>Lyricist:</strong> Rashmi Virag
                    </li>
                    <li>
                      <strong>Mixing & Mastering:</strong> Eric Pillai (Future
                      Sound of Bombay)
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/iUqPfGlg9GQ',
                          'https://www.youtube.com/watch?v=iUqPfGlg9GQ',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/album/3cDh6q8DISkIjX7sahQU8T',
                          'https://open.spotify.com/album/3cDh6q8DISkIjX7sahQU8T',
                          'Play on Spotify',
                          'spotify-album'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Song: Preet Re */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/preet-re-dhadak-2-500-500.jpg"
                    alt="Album art for Preet Re"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Preet Re
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Music Composer:</strong> Rochak Kohli
                    </li>
                    <li>
                      <strong>Singers:</strong> Darshan Raval, Jonita Gandhi &
                      Rochak Kohli
                    </li>
                    <li>
                      <strong>Mixing & Mastering:</strong> Eric Pillai (Future
                      Sound of Bombay)
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/k6q4lENp434',
                          'https://www.youtube.com/watch?v=k6q4lENp434',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/track/4XDQLLaOu6klew4c404PB1',
                          'https://open.spotify.com/track/4XDQLLaOu6klew4c404PB1',
                          'Play on Spotify',
                          'spotify-track'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Song: Duniya Alag */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/duniya-alag-dhadak-2-500-500.jpg"
                    alt="Album art for Duniya Alag"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Duniya Alag
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Music & Theme Composer:</strong> Shreyas Puranik
                    </li>
                    <li>
                      <strong>Singer:</strong> Arijit Singh
                    </li>
                    <li>
                      <strong>Mixing & Mastering:</strong> Eric Pillai (Future
                      Sound of Bombay)
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/gsM0YSX_fqA',
                          'https://www.youtube.com/watch?v=gsM0YSX_fqA',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/track/1mkticIrEKSsFvDtAetfQC',
                          'https://open.spotify.com/track/1mkticIrEKSsFvDtAetfQC',
                          'Play on Spotify',
                          'spotify-track'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Song: Bawaria */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/bawaria-dhadak-2-500-500.jpg"
                    alt="Album art for Bawaria"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">Bawaria</h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Music Composer:</strong> Tanishk Bagchi
                    </li>
                    <li>
                      <strong>Singers:</strong> Jubin Nautiyal & Suvarna Tiwari
                    </li>
                    <li>
                      <strong>Songs Recorded at:</strong> Studio 504
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/0ttXMfckx1c',
                          'https://www.youtube.com/watch?v=0ttXMfckx1c',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/track/1yW153uONgZNXaIa5xh41S',
                          'https://open.spotify.com/track/1yW153uONgZNXaIa5xh41S',
                          'Play on Spotify',
                          'spotify-track'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Song: Ye Kaisa Ishq */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/ye-kaisa-ishq-dhadak-2-500-500.jpg"
                    alt="Album art for Ye Kaisa Ishq"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Ye Kaisa Ishq
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Singer & Music Composer:</strong> Rochak Kohli
                    </li>
                    <li>
                      <strong>Mixed and Mastered by:</strong> Aditya Dev
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/tcVyFcprGqQ',
                          'https://www.youtube.com/watch?v=tcVyFcprGqQ',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/track/5CzzeXmmVEk6WXw1TDhQUg',
                          'https://open.spotify.com/track/5CzzeXmmVEk6WXw1TDhQUg',
                          'Play on Spotify',
                          'spotify-track'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Song: Tu Meri Dhadak Hai */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
                <div className="md:w-1/3 md:flex-shrink-0">
                  <img
                    className="w-full h-48 md:h-full object-cover"
                    src="https://pagalnew.com/coverimages/tu-meri-dhadak-hai-dhadak-2-500-500.jpg"
                    alt="Album art for Tu Meri Dhadak Hai"
                    onError={onImageError}
                  />
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Tu Meri Dhadak Hai
                  </h3>
                  <ul className="space-y-3 text-gray-300 text-sm">
                    <li>
                      <strong>Music Composer:</strong> Javed-Mohsin
                    </li>
                    <li>
                      <strong>Singer:</strong> Vishal Mishra
                    </li>
                    <li>
                      <strong>Mixing & Mastering:</strong> Eric Pillai (Future
                      Sound of Bombay)
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://www.youtube.com/embed/COcj4lBiHTc',
                          'https://www.youtube.com/watch?v=COcj4lBiHTc',
                          'Play on YouTube',
                          'youtube'
                        )
                      }
                    >
                      <img
                        src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                        alt="YouTube"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                      onClick={() =>
                        openModal(
                          'https://open.spotify.com/embed/track/7KHejeKMFgFJ57PUO7RMbe',
                          'https://open.spotify.com/track/7KHejeKMFgFJ57PUO7RMbe',
                          'Play on Spotify',
                          'spotify-track'
                        )
                      }
                    >
                      <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                        alt="Spotify"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dhadak 2 Production Credits */}
              <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Dhadak 2 - Film Production Credits
                </h3>
                <p className="text-gray-300 mb-4">
                  Zee Studios, Dharma Productions & Cloud 9 Pictures present A
                  Dharma Productions Film
                </p>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li>
                    <strong>Starring:</strong> Siddhant Chaturvedi & Triptii Dimri
                  </li>
                  <li>
                    <strong>Directed by:</strong> Shazia Iqbal
                  </li>
                  <li>
                    <strong>Produced by:</strong> Karan Johar, Umesh Kumar Bansal,
                    Adar Poonawalla, Apoorva Mehta, Meenu Aroraa, Somen Mishra &
                    Pragati Deshmukh
                  </li>
                  <li>
                    <strong>Co-producer:</strong> Marijke deSouza
                  </li>
                  <li>
                    <strong>Adapted Story, Screenplay & Dialogues:</strong> Rahul
                    Badwelkar & Shazia Iqbal
                  </li>
                </ul>
              </div>
            </div>
          </section>
          {/* === END SECTION 2 === */}

          {/* === SECTION 3: Saiyaara Playlist === */}
          <section id="saiyaara">
            {/* Main Playlist Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <img
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                src="https://i.ytimg.com/vi/dQCHTmQiy7Q/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDjv1DYh2U0FoffqFUwglNbt7lZIw"
                alt="Saiyaara Playlist Cover Art"
                onError={onImageError}
              />

              <div className="p-6 md:p-10">
                <h2 className="text-4xl font-bold text-white text-center mb-10">
                  Saiyaara - Full Playlist
                </h2>

                {/* Player Buttons */}
                <div className="mt-6 mb-10 flex flex-wrap gap-4 justify-center">
                  <button
                    className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    onClick={() =>
                      openModal(
                        'https://www.youtube.com/embed/lAuK9cYebAs',
                        'https://www.youtube.com/watch?v=lAuK9cYebAs',
                        'Play on YouTube',
                        'youtube'
                      )
                    }
                  >
                    <img
                      src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                      alt="YouTube"
                      className="w-5 h-5"
                    />
                    Play Jukebox on YouTube
                  </button>
                  <button
                    className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    onClick={() =>
                      openModal(
                        'https://open.spotify.com/embed/album/0tugMf048N72PBS0v8J2bu',
                        'https://open.spotify.com/album/0tugMf048N72PBS0v8J2bu',
                        'Play on Spotify',
                        'spotify-album'
                      )
                    }
                  >
                    <img
                      src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                      alt="Spotify"
                      className="w-5 h-5"
                    />
                    Play Album on Spotify
                  </button>
                </div>

                {/* Inner Grid for Song Credits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Song: Saiyaara */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Saiyaara
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> Tanishk Bagchi, Faheem Abdullah,
                        Arslan Nizami
                      </li>
                      <li>
                        <strong>Singer:</strong> Faheem Abdullah
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Eric Pillai (Future
                        Sound Of Bombay)
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/BSJa1UytM8w',
                            'https://www.youtube.com/watch?v=BSJa1UytM8w',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/1XbFQ7JxVTMcOioBx5HOfF',
                            'https://open.spotify.com/track/1XbFQ7JxVTMcOioBx5HOfF',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Barbaad */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Barbaad
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> The Rish
                      </li>
                      <li>
                        <strong>Singer:</strong> Jubin Nautiyal
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Eric Pillai (Future
                        Sound Of Bombay)
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/0v5eHPfy5Lk',
                            'https://www.youtube.com/watch?v=0v5eHPfy5Lk',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/2fUyxsSdG567kSWRgkmdVL',
                            'https://open.spotify.com/track/2fUyxsSdG567kSWRgkmdVL',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Tum To Toh */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Tum To Toh
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> Vishal Mishra
                      </li>
                      <li>
                        <strong>Singers:</strong> Vishal Mishra, Hansika Pareek
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Trihangku Lahkar
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/rOUuGvJkBrQ',
                            'https://www.youtube.com/watch?v=rOUuGvJkBrQ',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/7Fp87BflUvGnMNdEDjCF9s',
                            'https://open.spotify.com/track/7Fp87BflUvGnMNdEDjCF9s',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Humsafar */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Humsafar
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> Sachet-Parampara
                      </li>
                      <li>
                        <strong>Singers:</strong> Sachet Tandon, Parampara Tandon
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Shadab Rayeen
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/D9DiMnlpFK8',
                            'https://www.youtube.com/watch?v=D9DiMnlpFK8',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/4aaZBZ78BJP3qANZxHW8lS',
                            'https://open.spotify.com/track/4aaZBZ78BJP3qANZxHW8lS',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Dhun */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Dhun</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Composed, Arranged & Produced By:</strong>{' '}
                        Mithoon
                      </li>
                      <li>
                        <strong>Singer:</strong> Arijit Singh
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Eric Pillai (Future
                        Sound Of Bombay)
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/cUmUOb7j3dc',
                            'https://www.youtube.com/watch?v=cUmUOb7j3dc',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/1lCm78EFUR1THnF4Xa5bER',
                            'https://open.spotify.com/track/1lCm78EFUR1THnF4Xa5bER',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Saiyaara Reprise - Female */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Saiyaara Reprise - Female
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> Tanishk Bagchi, Faheem Abdullah,
                        Arslan Nizami
                      </li>
                      <li>
                        <strong>Singer:</strong> Shreya Ghoshal
                      </li>
                      <li>
                        <strong>Mixed & Mastered by:</strong> Eric Pillai (Future
                        Sound Of Bombay)
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/asG7cwxi1sA',
                            'https://www.youtube.com/watch?v=asG7cwxi1sA',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/2dFwNDQlgoAyDKjG2qjUs1',
                            'https://open.spotify.com/track/2dFwNDQlgoAyDKjG2qjUs1',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Song: Barbaad Reprise - Female */}
                  <div className="bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Barbaad Reprise - Female
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>
                        <strong>Music:</strong> The Rish
                      </li>
                      <li>
                        <strong>Singer:</strong> Shilpa Rao
                      </li>
                      <li>
                        <strong>Mixed & Mastered By:</strong> Hanish Taneja
                        (Studio Alika)
                      </li>
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-4">
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://www.youtube.com/embed/3pYKz7Ex-28',
                            'https://www.youtube.com/watch?v=3pYKz7Ex-28',
                            'Play on YouTube',
                            'youtube'
                          )
                        }
                      >
                        <img
                          src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                          alt="YouTube"
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                        onClick={() =>
                          openModal(
                            'https://open.spotify.com/embed/track/0MuyQBnHpnqEKKafbNpjNU',
                            'https://open.spotify.com/track/0MuyQBnHpnqEKKafbNpjNU',
                            'Play on Spotify',
                            'spotify-track'
                          )
                        }
                      >
                        <img
                          src="https://storage.googleapis.com/pr-newsroom-wp/1/2021/02/Spotify_Icon_RGB_Green.png"
                          alt="Spotify"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* === END SECTION 3 === */}

          {/* === SECTION 4: Falling Snow === */}
          <section id="falling-snow">
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden md:flex">
              {/* Image */}
              <div className="md:w-1/3 md:flex-shrink-0">
                <img
                  className="w-full h-48 md:h-full object-cover"
                  src="https://happysoulmusic.com/wp-content/grand-media/image/Aakash_Gandhi_free_music_download_1.webp"
                  alt="Album art for Falling Snow by Aakash Gandhi"
                  onError={onImageError}
                />
              </div>
              {/* Content */}
              <div className="p-6 md:p-8 md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Falling Snow
                </h2>
                <ul className="space-y-3 text-gray-300">
                  <li>
                    <strong>Artist:</strong> Aakash Gandhi
                  </li>
                </ul>
                {/* Player Buttons */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    className="open-modal-btn inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    onClick={() =>
                      openModal(
                        'https://www.youtube.com/embed/6E0J2J4Ybf8',
                        'https://www.youtube.com/watch?v=6E0J2J4Ybf8',
                        'Play on YouTube',
                        'youtube'
                      )
                    }
                  >
                    <img
                      src="https://png.pngtree.com/png-clipart/20221018/ourmid/pngtree-youtube-social-media-3d-stereo-png-image_6308427.png"
                      alt="YouTube"
                      className="w-5 h-5"
                    />
                    Play on YouTube
                  </button>
                  {/* Spotify button removed as per user note */}
                </div>
              </div>
            </div>
          </section>
          {/* === END SECTION 4 === */}
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-700 text-center">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              {/* Simple Home Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1h2z"
                />
              </svg>
              Go to Home
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Quicklink. All music rights, licenses, and credits belong to
            their respective owners.
          </p>
        </footer>

        {/* === MODAL === */}
        {isModalOpen && (
          <div
            id="playerModal"
            ref={modalRef}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          >
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 id="modalTitle" className="text-xl font-semibold text-white">
                  {modalData.title}
                </h3>
                <button
                  id="closeModalBtn"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={closeModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Iframe Container */}
              <div id="iframeHost" className={iframeContainerClasses}>
                <iframe
                  id="modalIframe"
                  ref={iframeRef}
                  className="responsive-iframe"
                  src={modalData.embedSrc}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-700/50 text-right">
                <a
                  id="modalGoLink"
                  href={modalData.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Go to Full Page
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        {/* === END MODAL === */}
      </div>
    </div>
  );
};

export default CopyrightPage;
