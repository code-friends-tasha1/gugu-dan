'use client';

import React, {useRef, useState} from "react";
import html2canvas from 'html2canvas';

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomGugudanProblems(count: number) {
    const problems = [];

    for (let i = 0; i < count; i++) {
        const dan = getRandomInt(2, 9);
        const number = getRandomInt(1, 9);
        const problem = `${dan} x ${number} = `;
        problems.push(problem);
    }

    return problems;
}


function chunkArray(array: string[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}

const QuestionList = ({questions, startIndex}: { questions: string[]; startIndex: number }) => {

    return (
        <table className={'gugu-item-container'}>
            <thead style={{marginBottom: '30px'}}>
            <tr>
                <th>번호</th>
                <th>문제</th>
                <th>답안</th>
            </tr>
            </thead>
            <tbody>
            {questions.map((item, idx) => (
                <tr key={`gugu-${startIndex + idx}`}>
                    <td> Q{startIndex + idx + 1}.</td>
                    <td className={'question-block'}>
                        <p style={{fontSize: '1.5rem'}}>
                            {item}
                        </p>
                    </td>
                    <td>
                        <div className={'block'}/>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
        ;
};


export default function Home() {
    const [questions, setQuestions] = useState<any>();

    const captureRef = useRef(null);

    const getGuGuDanProblems = () => {
        const randomProblems = generateRandomGugudanProblems(20);
        const result = chunkArray(randomProblems, 10);
        setQuestions(result);
    }

    const handleDownloadImage = async () => {
        const element = captureRef.current;
        if (!element) return;

        const canvas = await html2canvas(element, { useCORS: true });
        const data = canvas.toDataURL('image/png');

        if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`<a href="${data}" download="page_capture.png">여기를 눌러 이미지를 다운로드하세요</a><br/><img src="${data}" style="width:100%;" />`);
            }
        } else {
            const link = document.createElement('a');
            link.href = data;
            link.download = 'page_capture.png';
            link.click();
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div style={{width: '100%'}}>
                <div className={'title-area'}>
                    <p>만든 사람: react_developer [글놀이반 화이팅]</p>
                    <p>만든 이유: 운정초 2학년 여름방학 숙제가 구구단 외우기라서</p>
                    <p>업데이트 내역: 모바일에서 이미지 다운로드가 안되어 코드 추가함.</p>
                    <p>공부해라 초딩들.</p>
                </div>
                <div className={'button-area'}>
                    <button onClick={getGuGuDanProblems}
                            className={'question-create-button'}>구구단 20문제 생성하기
                    </button>
                    {questions &&
                      <button className={'question-create-button'} onClick={handleDownloadImage}>이미지로 다운로드</button>}
                </div>
                <div className={'gugu-container'} ref={captureRef}>
                    {questions && questions.map((chunk: string[], idx: number) => (
                        <QuestionList key={idx} questions={chunk} startIndex={idx * 10}/>
                    ))}
                </div>
            </div>

        </main>
    );
}
