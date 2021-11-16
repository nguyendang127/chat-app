import { Modal, Input, Button, Form, Space, Image, Avatar, Typography, message  } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import './AddFriendModal.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { FindFriend, selectFriend, addFriend } from './AddFriendSlice';
const { Title, Text } = Typography;

interface ModalProps {
  isModalVisible: boolean;
  handleOk: () => void | undefined;
  handleCancel: () => void | undefined;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}



const AddFriendModal: FC<ModalProps> = (props) => {
  const { isModalVisible, setIsModalVisible, handleOk, handleCancel } = props;
  const [showSearchResult, setShowSearchResult] = useState(false);

  const friend = useAppSelector(selectFriend);
  const dispatch = useAppDispatch();
  const onFinish = (values: any) => {
    dispatch(FindFriend(values));
    setShowSearchResult(true);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const inputNumber = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.shiftKey === false) {
      onFinish(target.value);
    }
  };

  useEffect(() => {
    if (!isModalVisible) setShowSearchResult(false);
  }, [isModalVisible]);

  const key = 'updatable';
  const openMessage = () => {
    message.loading({ content: ' Wait a minute...', key });
    setTimeout(() => {
      message.success({ content: ' Make friends successfully!', key, duration: 2 });
      setIsModalVisible(false);
    }, 1000);
  };

  return (
    <>
      <Modal
        title="Add friend"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-add-friend"
        width={400}
        footer={
          !showSearchResult
            ? [
                <Button
                  type="text"
                  onClick={() => {
                    setIsModalVisible(true);
                  }}
                  size="large"
                >
                  Cancle
                </Button>,
                <Button
                  size="large"
                  form="searchFriend"
                  key="submit"
                  htmlType="submit"
                  type="primary"
                >
                  Search
                </Button>,
              ]
            : null
        }
      >
        {showSearchResult ? (
          <>
            <Image
              width={400}
              src="error"
              fallback="http://aimory.vn/wp-content/uploads/2017/10/no-image.png"
              className="modal-add-friend__cover-image"
            />
            <Space direction="vertical" className="modal-add-friend__info">
              <Avatar
                size={100}
                src={
                  <Image
                    src="error"
                    fallback="http://aimory.vn/wp-content/uploads/2017/10/no-image.png"
                  />
                }
                className="modal-add-friend__avatar"
              />

              <Title level={4}>{friend.username || ''}</Title>

              <Button
                type="primary"
                onClick={() => {
                  dispatch(addFriend(friend));
                  openMessage();
                }}
              >
                Add friend
              </Button>

              <Space direction="vertical">
                <Text>Username: {friend.username || ''}</Text>
                <Text>Phone number: {friend.phoneNumber || 'Not updated yet'}</Text>
                <Text>Gender: {friend.gender ? 'Male' : 'Female'}</Text>
                <Text>Birthday: {friend.birthday || 'Not updated yet'}</Text>
              </Space>
            </Space>
          </>
        ) : (
          <Form
            name="searchFriend"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ padding: '1rem' }}
          >
            <Form.Item
              name="phoneNumber"
              rules={[{ required: true, message: 'Please input friend username!' }]}
            >
              <Input
                placeholder="username, Ex: pumk1206"
                className="modal-add-friend__search"
                size="large"
                onKeyPress={(e: any) => {
                  inputNumber(e);
                }}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default AddFriendModal;
