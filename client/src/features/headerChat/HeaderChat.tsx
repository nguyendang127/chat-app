import AccountModal from 'features/accountModal/AccountModal';
import { Menu, Avatar, Badge, Image, Space, Typography, Dropdown, Button, Spin } from 'antd';
import { MoreOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import './HeaderChat.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectUserModal, selectUserUpdate } from 'features/accountModal/accountModalSlice';
import { acceptRequest, denyRequest, fetchListRequest, removeRequest } from './headerChatSlice';
import { time } from 'console';

const { Title, Text } = Typography;

const HeaderChat = () => {
  const dispatch = useAppDispatch();

  const [isModalVisibleAccount, setIsModalVisibleAccount] = useState(false);
  const showModalAccount = () => {
    setIsModalVisibleAccount(true);
  };

  const handleOkAccount = () => {
    setIsModalVisibleAccount(false);
  };

  const handleCancelAccount = () => {
    setIsModalVisibleAccount(false);
  };
  const InfoUser = useAppSelector(selectUserModal);
  const loading = useAppSelector(selectUserUpdate);
  const listRequest: Array<{
    avatar: string;
    phoneNumber: string;
    username: string;
  }> = useAppSelector((state) => state.headerChat.listRequest);
  useEffect(() => {
    dispatch(fetchListRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menu = (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<UserOutlined />} onClick={() => showModalAccount()}>
          Account
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type="link"
          danger
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.removeItem('access_token');
            window.location.reload();
          }}
        >
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );

  const menuNotification = (
    <Menu>
      {listRequest &&
        listRequest.map((item, index) => {
          return (
            <Menu.Item key="0">
              <Space>
                <Text>
                  <b>{item.username}</b> wants to be friends with you
                </Text>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      dispatch(acceptRequest(item.phoneNumber));
                      dispatch(removeRequest(index));
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="small"
                    onClick={() => {
                      dispatch(denyRequest(item.phoneNumber));
                      dispatch(removeRequest(index));
                    }}
                  >
                    Deny
                  </Button>
                </Space>
              </Space>
            </Menu.Item>
          );
        })}
    </Menu>
  );

  return (
    <>
      <AccountModal
        isModalVisible={isModalVisibleAccount}
        setIsModalVisible={setIsModalVisibleAccount}
        handleOk={handleOkAccount}
        handleCancel={handleCancelAccount}
      />
      <Spin spinning={loading} tip="Loading..." size="large">
        <div className="header-chat">
          <Title level={2} style={{ marginBottom: '0px', color: 'white' }}>
            Chat App
          </Title>
          <Space>
            <Space size="large">
              <Dropdown
                overlay={menuNotification}
                trigger={['click']}
                disabled={listRequest.length === 0}
              >
                <Badge count={listRequest.length} offset={[-5, 5]}>
                  <Avatar
                    size={50}
                    src={
                      <Image
                        preview={false}
                        src={InfoUser.user_avatar ? InfoUser.user_avatar : 'error'}
                        fallback="https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg"
                      />
                    }
                    style={{ border: '1px solid #fff', cursor: 'pointer' }}
                  />
                </Badge>
              </Dropdown>
              <section>
                <Title level={5} style={{ marginBottom: '0px', color: 'white' }}>
                  {InfoUser.user_display_name || InfoUser.user_name}
                </Title>
                <Badge color={'#54ff00'} text={'Online'} style={{ color: '#fff' }} />
              </section>
              <Dropdown overlay={menu} trigger={['click']}>
                <MoreOutlined style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
              </Dropdown>
            </Space>
          </Space>
        </div>
      </Spin>
    </>
  );
};

export default HeaderChat;
