'use client';

import React, {useRef, useState} from 'react';
import {Typography, Flex, Card, Button, Tooltip, Input} from "antd";
import LoadingBar from "@/component/loadingBar/loadingBar";
import CustomDivider from "@/component/divider/customDivider";
import html2canvas from "html2canvas";

const {Title, Text} = Typography;

interface ProblemsProps {
  expression: string;
  answer: string;
}

function getRandomDigit(val: number) {
  return Math.floor(Math.random() * val) + 1; // 1부터 ? 까지의 자연수
}

function getRandomOperator() {
  const operators = ['+', '-', '*', '/'];
  return operators[Math.floor(Math.random() * operators.length)];
}

const QuestionList = ({questions, startIndex}: { questions: ProblemsProps[]; startIndex: number }) => {
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
            <p style={{fontSize: '1.2rem'}}>{item.expression} = </p>
          </td>
          <td style={{ minWidth: '80px' }}>
            <div className="block"/>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

const AnswerList = ({questions, startIndex}: { questions: ProblemsProps[]; startIndex: number }) => {
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
            <p style={{fontSize: '1.2rem'}}>{item.expression} = {item.answer}</p>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

function generateRandomExpression(val: number, numTerms: number) {
  let expression = getRandomDigit(val).toString();
  let currentResult = parseInt(expression);

  for (let i = 1; i < numTerms; i++) {
    const operator = getRandomOperator();
    const digit = getRandomDigit(val);

    if (operator === '-' && currentResult - digit < 0) {
      expression += ` + ${digit}`;
      currentResult += digit;
    } else if (operator === '/') {
      expression += ` * ${digit}`; // 곱셈으로 변경하여 음수 문제 방지
      currentResult *= digit;
    } else {
      expression += ` ${operator} ${digit}`;
      currentResult = operator === '+' ? currentResult + digit : operator === '-' ? currentResult - digit : operator === '*' ? currentResult * digit : Math.floor(currentResult / digit);
    }
  }

  return expression;
}

function evaluateExpression(expression: string) {
  try {
    return eval(expression);
  } catch (e) {
    console.error('Invalid expression:', expression);
    return null;
  }
}

function generateProblems(val: number, numTerms: number) {
  const problems = [];

  for (let i = 0; i < 20; i++) {
    const expression = generateRandomExpression(val, numTerms);
    const answer = evaluateExpression(expression);
    problems.push({expression, answer});
  }

  return problems;
}

const MathPage = () => {
  const [loading, setLoading] = useState(false);
  const [numTerms, setNumTerms] = useState<number>(2); //연산자 몇개까지?
  const [numberMaxVal, setNumberMaxVal] = useState<number>(10); //숫자 범위
  const [problems, setProblems] = useState<ProblemsProps[][]>([]);
  const [showAnswer, setShowAnswer] = useState<boolean>(true);
  const captureRef = useRef(null);

  const setNumTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);

    if (/^\d{0,2}$/.test(value) && numericValue <= 6) {
      setNumTerms(numericValue);
    }
  };

  const setNumberMaxValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    if (/^\d{0,3}$/.test(value)) {
      setNumberMaxVal(Number(value));
    }
  };

  const createdProblems = () => {
    if (numberMaxVal < 1 || numTerms < 1) {
      alert('연산 정보가 정확하지 않습니다.');
      return;
    }
    const problems = generateProblems(numberMaxVal, numTerms);
    setProblems(chunkArray(problems, 10));
  }

  function chunkArray(array: ProblemsProps[], chunkSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

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
      const file = new File([blob], 'math.png', {type: 'image/png'});

      if (navigator.canShare && navigator.canShare({files: [file]})) {
        await navigator.share({
          files: [file],
          title: '수학 20문제',
          text: '수학 20문제.',
        });
        console.log('Share was successful.');
      } else {
        if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(
              `<a href="${dataUrl}" download="math.png">https 지원을 하지 않아 다운로드가 원할하지 않습니다. 이미지를 길게 눌러 파일로 저장하세요.</a><br/><img src="${dataUrl}" style="width:100%;" />`
            );
          }
        } else {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'math.png';
          link.click();
        }
      }
    } catch (error) {
      console.error('Error capturing or sharing the image', error);
    } finally {
      setLoading(false); // 로딩 바 제거
    }
  };

  return (
    <Card styles={{body: {padding: 24, overflow: 'hidden'}}}>
      {loading && <LoadingBar/>}
      <Flex vertical>
        <CustomDivider><Title level={5}>초딩 기본 사칙연산 문제 생성기</Title></CustomDivider>
        <Text type="secondary">- 초딩 기본 사칙연산 문제 생성기 사용 법</Text>
        <br/>
        <Text type="secondary"><b>1. 최대 연산 가능 숫자란? 내가 최대 연산하고 싶은 숫자를 입력합니다.(최대: 999)</b></Text>
        <Text type={'secondary'}> 예를 들어, <br/>
          1~10 안으로 숫자를 계산하고 싶다면<br/>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <b>최대 연산 가능 숫자</b>에 <b>"10"</b>을 입력하여 1~10 사이에 사칙연산을 랜덤으로 20문항을 생성합니다.
          1~999 안으로 숫자를 계산하고 싶다면<br/>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <b>최대 연산 가능 숫자</b>에 <b>"999"</b>을 입력하여 1~999 사이에 사칙연산을 랜덤으로 20문항을 생성합니다.
        </Text>
        <br/>
        <Text type="secondary"><b>2. 사칙연산 항 갯수? 내가 최대 연산 하고자하는 항의 갯수를 입력합니다. (최대 6항까지만 허용합니다)</b></Text>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text type={'secondary'}> 예를 들어, <br/><b>항 갯수가 2인경우:</b> 2+3 = 5 <br/><b>항 갯수가 3인경우:</b> 2+3+3 = 8 <br/> <b>항 갯수가 5인경우:</b> 2+2+2+2+2 = 10 </Text>

        <CustomDivider/>
        <Flex wrap gap={'middle'}>
          <Tooltip trigger={['focus']} title={'최대 연산 가능 숫자'} placement="topLeft" overlayClassName="numeric-input">
            <Flex align={'center'} justify={'flex-start'}>
              <Title level={5} style={{textAlign: 'center', flex: 1}}>최대 연산 가능 숫자</Title>
              <Input
                type="number"
                onChange={setNumberMaxValChange}
                placeholder="최대로 연산할 숫자를 입력 하세요.(최대 999)"
                maxLength={3}
                value={numberMaxVal}
                style={{flex: 1}}
              />
            </Flex>
          </Tooltip>
          <Tooltip trigger={['focus']} title={'한 항에 들어가는 덧셈 뺄셈 갯수'} placement="topLeft" overlayClassName="numeric-input">
            <Flex align={'center'} justify={'flex-start'}>
              <Title level={5} style={{textAlign: 'center', flex: 1}}>사칙연산 항 갯수 </Title>
              <Input
                type="number"
                onChange={setNumTermsChange}
                placeholder="한 항에 들어가는 덧셈 뺄셈 갯수"
                maxLength={1}
                value={numTerms}
                style={{flex: 1}}
              />
            </Flex>
          </Tooltip>
          <Flex align={'center'} justify={'flex-start'} wrap gap={'middle'} >
            <Button onClick={createdProblems}>20 문항 생성하기</Button>
            {problems && (
              <Button onClick={handleDownloadImage}>
                이미지로 다운로드
              </Button>
            )}
          </Flex>
          <Flex>
            <div className="gugu-container" ref={captureRef} style={{padding: '20px 20px', minWidth: '1024px', overflowX: 'scroll'}}>
              <div className={'gugu-problems-container'}>
                {problems &&
                  problems.map((chunk: ProblemsProps[], idx: number) => (
                    <QuestionList key={idx} questions={chunk} startIndex={idx * 10}/>
                  ))}
              </div>
              {showAnswer && <div className={'gugu-problems-container'}>
                {problems &&
                  problems.map((chunk: ProblemsProps[], idx: number) => (
                    <AnswerList key={idx} questions={chunk} startIndex={idx * 10}/>
                  ))}
              </div>}
            </div>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default MathPage;
