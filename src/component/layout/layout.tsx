'use client'
import React, { useEffect, useState } from 'react';
import {Layout, Menu, theme} from 'antd';
import { usePathname } from 'next/navigation';
import {Typography} from "antd";

import Link from 'next/link';
const {Title, Text} = Typography;

const {Header, Content, Footer} = Layout;

const items = [
  {
    key: '1',
    label: <Link href="/">구구단</Link>,
    href: '/'
  },
  {
    key: '2',
    label: <Link href="/korean">국어</Link>,
    href: '/korean'
  },
  {
    key: '3',
    label: <Link href="/math">더하기/빼기</Link>,
    href: '/math'
  },
  {
    key: '4',
    label: <Link href="/four-math">사칙연산</Link>,
    href: '/four-math'
  },

];

const MainLayout = ({children}: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState('1');

  useEffect(() => {
    const currentItem = items.find((item) => item.href === pathname);
    if (currentItem) {
      setSelectedKey(currentItem.key);
    }
  }, [pathname]);
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();
  return (
    <Layout>
      <Header style={{display: 'flex', alignItems: 'center'}}>
        <div className="demo-logo"/>
        <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ flex: 1, minWidth: 0 }} items={items}/>
      </Header>
      <Content>
        <main
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </main>
      </Content>
      <Footer style={{textAlign: 'left'}}>
        <Text type={'secondary'}>운정 초 글놀이반 방학숙제 및 학습용 컨텐츠 제작</Text>
        <br/>
        <Text type={'secondary'}>오류 문의 : react_developer@kakao.com</Text>
        <Title level={5}>Created By: React Developer</Title>
      </Footer>
    </Layout>
  )
};

export default MainLayout;