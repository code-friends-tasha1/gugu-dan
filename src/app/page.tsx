'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import Checkbox from '@/component/checkbox';
import Image from "next/image";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const guguItems = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const defaultGuguItems = [2, 3, 4, 5, 6, 7, 8, 9];

const pdfList = [{title: '1급', fileName: '1_korean', newFileName: '1급_복습표'},
  {title: '2급', fileName: '2_korean', newFileName: '2급_복습표'},
  {title: '3급', fileName: '3_korean', newFileName: '3급_복습표'},
  {title: '4급', fileName: '4_korean', newFileName: '4급_복습표'},
  {title: '5급', fileName: '5_korean', newFileName: '5급_복습표'},
  {title: '6급', fileName: '6_korean', newFileName: '6급_복습표'},
  {title: '7급', fileName: '7_korean', newFileName: '7급_복습표'},
  {title: '8급', fileName: '8_korean', newFileName: '8급_복습표'}];

interface GuGuDanProps {
  problem: string;
  answer: string;
}

function generateRandomGugudanProblems(count: number, selectedItems: number[]) {
  const problems: GuGuDanProps[] = [];

  for (let i = 0; i < count; i++) {
    const dan = selectedItems[getRandomInt(0, selectedItems.length - 1)];
    const number = getRandomInt(1, 9);
    const problem = `${dan} x ${number} = `;
    const answer = `${dan} x ${number} = ${dan * number}`;
    problems.push({problem: problem, answer: answer});
  }

  return problems;
}

function chunkArray(array: GuGuDanProps[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

const QuestionList = ({questions, startIndex}: { questions: GuGuDanProps[]; startIndex: number }) => {
  return (
    <table className="gugu-item-container">
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
          <td className="question-block">
            <p style={{fontSize: '1.5rem'}}>{item.problem}</p>
          </td>
          <td>
            <div className="block"/>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};


const AnswerList = ({questions, startIndex}: { questions: GuGuDanProps[]; startIndex: number }) => {
  return (
    <table className="gugu-item-container">
      <thead style={{marginBottom: '30px'}}>
      <tr>
        <th>번호</th>
        <th>답안지</th>
      </tr>
      </thead>
      <tbody>
      {questions.map((item, idx) => (
        <tr key={`gugu-${startIndex + idx}`}>
          <td> Q{startIndex + idx + 1}.</td>
          <td className="question-block">
            <p style={{fontSize: '1.5rem'}}>{item.answer}</p>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default function Home() {
  const [questions, setQuestions] = useState<GuGuDanProps[][]>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectDefault, setSelectDefault] = useState<boolean>(true);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('math');
  const captureRef = useRef(null);

  const getGuGuDanProblems = () => {
    if (selectedItems.length === 0) {
      alert('단을 선택해 주세요.');
      return;
    }

    const randomProblems = generateRandomGugudanProblems(20, selectedItems);
    const result = chunkArray(randomProblems, 10);
    setQuestions(result);
  };

  const handleDownloadImage = async () => {
    const element = captureRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { useCORS: true });
    const dataUrl = canvas.toDataURL('image/png');

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'page_capture.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Page Capture',
          text: 'Here is the image I captured from the page.',
        });
        console.log('Share was successful.');
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(
            `<a href="${dataUrl}" download="page_capture.png">https 지원을 하지 않아 다운로드가 원할하지 않습니다. 이미지를 길게 눌러 파일로 저장하세요.</a><br/><img src="${dataUrl}" style="width:100%;" />`
          );
        }
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'page_capture.png';
        link.click();
      }
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const item = Number(event.target.value);
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectDefault(false);
    setSelectedItems(isChecked ? guguItems : []);
  };

  const handleSelectDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectDefault(isChecked);
    setSelectAll(false);
    setSelectedItems(isChecked ? defaultGuguItems : []);
  };

  const closeAnswer = useCallback(() => {
    setShowAnswer(!showAnswer);
  }, [showAnswer])

  useEffect(() => {
    setSelectedItems(defaultGuguItems);
  }, []);

  const changeTab = useCallback(() => {
    setCurrentTab(currentTab === 'math' ? 'korean' : 'math');
  }, [currentTab]);

  const downloadPDF = async (value: string, newValue: string) => {
    const response = await fetch(`/api/download?filename=${value}.pdf`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${newValue}.pdf`);

    // Append to the document and trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the link from the document
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div style={{width: '100%'}}>
        <div className="title-area">
          <p>만든 사람: react_developer [글놀이반 학부모1]</p>
          <p>제작 사유: 운정초 2학년 여름방학 숙제가 구구단 외우기라서</p>
          <p>업데이트 내역</p>
          <ul>
            <li> - 2024.07.23 모바일에서 이미지 다운로드가 안되어 코드 추가함.</li>
            <li> - 2024.07.29 단 선택 기능 추가, 19단까지 확장, 답안지 추가</li>
          </ul>
        </div>
        <div className={'tab-wrapper'}>
          <button
            className={`area-tab-button ${currentTab === 'math' ? 'active' : ''}`}
            onClick={changeTab}
          >수학 영역
          </button>
          <button
            className={`area-tab-button ${currentTab === 'korean' ? 'active' : ''}`}
            onClick={changeTab}
          >국어 영역
          </button>
        </div>
        {currentTab === 'math' && <div>
          <div className="button-area">
            <h6 className={'dan-typography'}>출력하고 싶은 단 선택</h6>
            <div className={'dan-wrapper'}>
              <div className={'dan-category-wrapper'}>
                <Checkbox
                  title="전체 선택"
                  onChange={handleSelectAllChange}
                  value="selectAll"
                  id="selectAll"
                  checked={selectAll}
                />
                <Checkbox
                  title="기본 선택"
                  onChange={handleSelectDefaultChange}
                  value="selectDefault"
                  id="selectDefault"
                  checked={selectDefault}
                />
              </div>
              <div className={'dan-title-container'}>
                {guguItems.map((item) => (
                  <Checkbox
                    key={`${item}-dan-key`}
                    value={`${item}`}
                    onChange={handleCheckboxChange}
                    id={`${item}dan`}
                    title={`${item}단`}
                    checked={selectedItems.includes(item)}
                  />
                ))}
              </div>
            </div>

            {selectedItems && <button onClick={getGuGuDanProblems} className="question-create-button">
              구구단 20문제 생성하기
            </button>}
            {questions && (
              <button className="question-create-button" onClick={handleDownloadImage}>
                이미지로 다운로드
              </button>
            )}
            {questions && (
              <button className="question-create-button" onClick={closeAnswer}>
                {showAnswer ? '답안지 가리기' : '답안지 나타내기'}
              </button>
            )}
          </div>
          <div className="gugu-container" ref={captureRef}>
            <div className={'gugu-problems-container'}>
              {questions &&
                questions.map((chunk: GuGuDanProps[], idx: number) => (
                  <QuestionList key={idx} questions={chunk} startIndex={idx * 10}/>
                ))}
            </div>
            <div className={'divider'}/>
            {showAnswer && <div className={'gugu-problems-container'}>
              {questions &&
                questions.map((chunk: GuGuDanProps[], idx: number) => (
                  <AnswerList key={idx} questions={chunk} startIndex={idx * 10}/>
                ))}
            </div>}
          </div>
        </div>}
        {currentTab === 'korean' &&
          <div>
            <div className="button-area">
              <h6 className={'dan-typography'}>복습 할 받아쓰기 선택</h6>
              <p>글씨가 지렁이인 아이를 위한 따라쓰기 PDF 다운로드 영역</p>
              <p>이렇게 까지 만들어줬는데 글씨 개발 세발 쓰면 너무한다 너...</p>
              <br/>
              <p>예시안)</p>
              <Image src={'/sample/sample-image.png'} alt={'sample-image'} width={441} height={278}/>
              {pdfList &&
                pdfList.map((item, idx) => {
                  return <button
                    key={`korea-${idx}`}
                    onClick={() => downloadPDF(item.fileName, item.newFileName)} className="question-create-button">
                    {item.title}따라쓰기.pdf
                  </button>
                })
              }
            </div>
          </div>
        }
      </div>
    </main>
  );
}
