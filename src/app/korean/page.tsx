'use client';

import React, {useState} from 'react';
import Image from "next/image";
import { Typography, Flex, Card, Button } from "antd";
import LoadingBar from "@/component/loadingBar/loadingBar";
import CustomDivider from "@/component/divider/customDivider";


const {Title, Text} = Typography;



const pdfList = [{title: '1급', fileName: '1_korean', newFileName: '1급_복습표'},
  {title: '2급', fileName: '2_korean', newFileName: '2급_복습표'},
  {title: '3급', fileName: '3_korean', newFileName: '3급_복습표'},
  {title: '4급', fileName: '4_korean', newFileName: '4급_복습표'},
  {title: '5급', fileName: '5_korean', newFileName: '5급_복습표'},
  {title: '6급', fileName: '6_korean', newFileName: '6급_복습표'},
  {title: '7급', fileName: '7_korean', newFileName: '7급_복습표'},
  {title: '8급', fileName: '8_korean', newFileName: '8급_복습표'},
];

const pdfList2 = [
  {title: '2학기_2급_복습표', fileName: '2_2korean', newFileName: '2학기_2급_복습표'},
  {title: '2학기_3급_복습표', fileName: '2_3korean', newFileName: '2학기_3급_복습표'},
  {title: '2학기_4급_복습표', fileName: '2_4korean', newFileName: '2학기_4급_복습표'},
  {title: '2학기_5급_복습표', fileName: '2_5korean', newFileName: '2학기_5급_복습표'},
  {title: '2학기_6급_복습표', fileName: '2_6korean', newFileName: '2학기_6급_복습표'},
  {title: '2학기_7급_복습표', fileName: '2_7korean', newFileName: '2학기_7급_복습표'},
  {title: '2학기_8급_복습표', fileName: '2_8korean', newFileName: '2학기_8급_복습표'},
]

export default function Page() {
  const [loading, setLoading] = useState(false);


  const downloadPDF = async (value: string, newValue: string) => {
    const response = await fetch(`/api/download?filename=${value}.pdf`);
    const blob = await response.blob();
    const file = new File([blob], `${value}.pdf`, {type: blob.type});
    if (navigator.canShare && navigator.canShare({files: [file]})) {
      setLoading(true); // 로딩 바 표시
      try {
        await navigator.share({
          files: [file],
          title: `${newValue}.pdf`,
          text: `${newValue}.pdf`,
        });
        console.log('공유에 성공했습니다.');
      } catch (error) {
        console.log('공유 오류', error);
      } finally {
        setLoading(false); // 로딩 바 제거
      }
    } else {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${value}.pdf`);

      // Append to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }
  };

  return (
    <Card styles={{body: {padding: 24, overflow: 'hidden'}}}>
      {loading && <LoadingBar/>}
      <Flex vertical>
        <CustomDivider><Title level={5}>복습 할 받아쓰기 선택</Title></CustomDivider>
        <Text type="secondary">- 글씨가 지렁이인 아이를 위한 따라쓰기 PDF 다운로드 영역</Text>
        <Text type="secondary">- 이렇게 까지 만들어줬는데 글씨 개발 새발 쓰면 너무한다 너...</Text>
        <Flex vertical>
          <br/>
          <Title level={5}> PDF 파일 예시안</Title>
          <Flex vertical justify={'flex-start'} align={'flex-start'}>
            <Image src={'/sample/sample-image.png'} alt={'sample-image'} width={441} height={278}/>
          </Flex>
          <CustomDivider><Title level={5}>2학년 1학기</Title></CustomDivider>
          <Flex wrap gap={'small'} style={{padding: '10px 10px'}} align={'center'}>
            {pdfList &&
              pdfList.map((item, idx) => {
                return <Button
                  key={`korea-${idx}`}
                  onClick={() => downloadPDF(item.fileName, item.newFileName)}>
                  {item.title}따라쓰기.pdf
                </Button>
              })
            }
          </Flex>
          <br/>
          <CustomDivider><Title level={5}>2학년 2학기</Title></CustomDivider>
          <Flex wrap gap={'small'} style={{padding: '10px 10px'}} align={'center'}>
            {pdfList2 &&
                pdfList2.map((item, idx) => {
                  return <Button
                      key={`korea-${idx}`}
                      onClick={() => downloadPDF(item.fileName, item.newFileName)}>
                    {item.title}따라쓰기.pdf
                  </Button>
                })
            }
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
