'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import {Typography, Flex, Card, Button, Checkbox, Divider} from "antd";
import type {CheckboxProps} from 'antd';
import styled from 'styled-components';
import LoadingBar from '@/component/loadingBar/loadingBar';
import CustomDivider from "@/component/divider/customDivider";

const {Title} = Typography;

const StyledCheckboxWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px; /* 체크박스 항목 사이의 간격 */
    margin-right: 16px;
`;

const CustomCheckbox = styled(Checkbox)`
    .ant-checkbox-inner {
        border-color: ${(props) => props.theme.colors.info};
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${(props) => props.theme.colors.info} !important;
        border-color: ${(props) => props.theme.colors.info};
    }
`;


const HeaderCustomCheckbox = styled(Checkbox)`
    .ant-checkbox {
        transform: scale(1.5); /* 체크박스 크기 조정 */
    }

    .ant-checkbox-inner {
        width: 20px; /* 내부 크기 */
        height: 20px; /* 내부 크기 */

    }

    span {
        font-size: 1.2em; /* 텍스트 크기 조정 */
    }

    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${(props) => props.theme.colors.secondary} !important;
        border-color: ${(props) => props.theme.colors.secondary};

    }

    .ant-checkbox-input {
        width: 20px;
        height: 20px;
    }
    .ant-checkbox-checked.ant-checkbox-inner::after {
        width: 20px;
        height: 20px;
        transform-origin: center;
        border-color: ${(props) => props.theme.colors.secondary};
    }
`;


function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const guguItems = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const defaultGuguItems = [2, 3, 4, 5, 6, 7, 8, 9];

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
  const captureRef = useRef(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true); // 로딩 바 표시

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
      });

      const a4Canvas = document.createElement('canvas');
      a4Canvas.width = 794; // 96 DPI 기준 A4 폭
      a4Canvas.height = 1123; // 96 DPI 기준 A4 높이
      const a4Context = a4Canvas.getContext('2d');

      const originalWidth = canvas.width;
      const originalHeight = canvas.height;
      const ratio = Math.min(a4Canvas.width / originalWidth, a4Canvas.height / originalHeight);
      const newWidth = originalWidth * ratio;
      const newHeight = originalHeight * ratio;

      (a4Context as any).fillStyle = 'white';
      (a4Context as any).fillRect(0, 0, a4Canvas.width, a4Canvas.height);
      (a4Context as any).drawImage(canvas, 0, 0, newWidth, newHeight);

      const dataUrl = a4Canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'gugudan.png', {type: 'image/png'});

      if (navigator.canShare && navigator.canShare({files: [file]})) {
        await navigator.share({
          files: [file],
          title: '구구단 20문제',
          text: '구구단 20문제.',
        });
        console.log('Share was successful.');
      } else {
        if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(
              `<a href="${dataUrl}" download="gugudan.png">https 지원을 하지 않아 다운로드가 원할하지 않습니다. 이미지를 길게 눌러 파일로 저장하세요.</a><br/><img src="${dataUrl}" style="width:100%;" />`
            );
          }
        } else {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'gugudan.png';
          link.click();
        }
      }
    } catch (error) {
      console.error('Error capturing or sharing the image', error);
    } finally {
      setLoading(false); // 로딩 바 제거
    }
  };

  const handleCheckboxChange: CheckboxProps['onChange'] = (event) => {
    const item = Number(event.target.value);
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter((i) => i !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const handleSelectAllChange: CheckboxProps['onChange'] = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setSelectDefault(false);
    setSelectedItems(isChecked ? guguItems : []);
  };

  const handleSelectDefaultChange: CheckboxProps['onChange'] = (event) => {
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

  return (
    <Card styles={{body: {padding: 24, overflow: 'hidden'}}}>
      {loading && <LoadingBar/>}
      <Flex vertical>
        <CustomDivider><Title level={5}>출력하고 싶은 단 선택</Title></CustomDivider>
        <Flex vertical style={{padding: '10px 10px', margin: '20px 0'}}>
          <Flex style={{marginBottom: '10px'}}>
            <StyledCheckboxWrapper>
              <HeaderCustomCheckbox
                onChange={handleSelectAllChange}
                value="selectAll"
                id="selectAll"
                style={{color: selectAll ? '#8c8c8c' : '#333333', fontWeight: selectAll ? 'bold' : 'normal'}}
                checked={selectAll}
              >전체 선택
              </HeaderCustomCheckbox>
            </StyledCheckboxWrapper>
            <StyledCheckboxWrapper>
              <HeaderCustomCheckbox
                onChange={handleSelectDefaultChange}
                value="selectDefault"
                id="selectDefault"
                style={{color: selectDefault ? '#8c8c8c' : '#333333', fontWeight: selectDefault ? 'bold' : 'normal'}}
                checked={selectDefault}
              >기본 선택
              </HeaderCustomCheckbox>
            </StyledCheckboxWrapper>
          </Flex>
          <Flex wrap gap={'small'}>
            {guguItems.map((item) => (
              <CustomCheckbox
                key={`${item}-dan-key`}
                value={`${item}`}
                onChange={handleCheckboxChange}
                id={`${item}dan`}
                style={{color: selectedItems.includes(item) ? '#ffab3e' : '#8c8c8c', fontWeight: selectedItems.includes(item) ? 'bold' : 'normal'}}
                checked={selectedItems.includes(item)}
              >{item}단</CustomCheckbox>
            ))}
          </Flex>
        </Flex>
        <CustomDivider/>
        <Flex wrap gap={'middle'} style={{padding: '10px 10px'}}>
          {selectedItems && <Button onClick={getGuGuDanProblems}>
            구구단 20문제 생성하기
          </Button>}
          {questions && (
            <Button onClick={handleDownloadImage}>
              이미지로 다운로드
            </Button>
          )}
          {questions && (
            <Button onClick={closeAnswer}>
              {showAnswer ? '답안지 가리기' : '답안지 나타내기'}
            </Button>
          )}
        </Flex>
        <CustomDivider/>
        <Flex>
          <div className="gugu-container" ref={captureRef} style={{padding: '20px 20px', minWidth: '1024px', overflowX: 'scroll'}}>
            <div className={'gugu-problems-container'}>
              {questions &&
                questions.map((chunk: GuGuDanProps[], idx: number) => (
                  <QuestionList key={idx} questions={chunk} startIndex={idx * 10}/>
                ))}
            </div>
            {showAnswer && <div className={'gugu-problems-container'}>
              {questions &&
                questions.map((chunk: GuGuDanProps[], idx: number) => (
                  <AnswerList key={idx} questions={chunk} startIndex={idx * 10}/>
                ))}
            </div>}
          </div>
        </Flex>
      </Flex>
    </Card>
  );
}
