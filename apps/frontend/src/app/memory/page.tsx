'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ReadingNote {
    title: string;
    content: string;
    tag: string;
  }

  const STORAGE_KEY = "reading_notes";


  export const saveNoteToLocalStorage = (note: ReadingNote) => {
    const notes = getNotesFromLocalStorage();
    notes.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  };
  
  export const getNotesFromLocalStorage = (): ReadingNote[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };


export default function MemoryPage() {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tag, setTag] = useState<string>("");


    const [notes, setNotes] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [tagFilter, setTagFilter] = useState<string>("");


    const handleCreateNote = async () => {

        if (!title || !content || !tag) {
            alert("모든 항목을 입력하세요.");
            return;
          }

          saveNoteToLocalStorage({ title, content, tag });

          alert("독서 노트가 생성되었습니다.");
          setTitle("");
          setContent("");
          setTag("");
      };    


      /*const filteredNotes = notes.filter((note) => {
        const matchesTitle = note.title.toLowerCase().includes(search.toLowerCase());
        const matchesContent = note.content.toLowerCase().includes(search.toLowerCase());
        const matchesTag = tagFilter ? note.tag === tagFilter : true;
    
        return (matchesTitle || matchesContent) && matchesTag;
      });
*/



    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">📚 읽은 책 기억 도구</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    {/* 구현 가이드 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">🎯 개발 목표</h3>
                            <div className="space-y-3 text-sm">
                                <p>• 프론트엔드: Next.js + TypeScript</p>
                                <p>• 백엔드: Express.js + API 구현</p>
                                <p>• 데이터: 백엔드 API 또는 localStorage</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">💡 구현 힌트</h3>
                            <div className="text-sm space-y-2">
                                <p>• POST /api/reading-notes - 독서 노트 저장</p>
                                <p>• GET /api/reading-notes - 노트 조회</p>
                                <p>• 검색 및 태그 기능</p>
                                <p>• 카드 형태 UI</p>
                            </div>
                        </div>
                    </div>

                    {/* 구현 영역 */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <h1>노트 생성</h1>
                        <p className="text-gray-500">
                        
                        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="책 제목"
            className="border p-2 rounded-md mb-4 w-full"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="독서 노트 내용"
            className="border p-2 rounded-md mb-4 w-full"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border p-2 rounded-md mb-4 w-full"
          >
            <option value="">태그 선택</option>
            <option value="로맨스">로맨스</option>
            <option value="판타지">판타지</option>
            <option value="무협">무협</option>
            <option value="추리">추리</option>
            <option value="일반문학">일반문학</option>
          </select>
          <button
            onClick={handleCreateNote}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            생성
          </button>
                        </p>
                        <div>
    <br></br>
    <h1>노트 검색</h1>
      <input
        type="text"
        placeholder="책 제목 또는 노트 내용 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-md mb-4 w-full"
      />
      <select
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        className="border p-2 rounded-md mb-4 w-full"
      >
        <option value="">태그 선택</option>
        <option value="로맨스">로맨스</option>
        <option value="판타지">판타지</option>
        <option value="무협">무협</option>
        <option value="추리">추리</option>
        <option value="일반문학">일반문학</option>
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/*{filteredNotes.map((note, index) => (
          <div key={index} className="border p-4 rounded-md shadow-md">
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.content}</p>
            <span className="bg-gray-200 text-sm px-2 py-1 rounded-full">
              {note.tag}
            </span>
          </div>
        ))}*/}
      </div>
    </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 