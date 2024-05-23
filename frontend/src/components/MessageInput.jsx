import { Flex, Image, Input, InputGroup, InputRightElement, Spinner, useDisclosure } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import showToast from '../customtoasthook/showToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chatAtom, selectConversation } from '../atoms/chatAtom';
import { BsFillImageFill } from 'react-icons/bs';
import previewImg from '../customtoasthook/previewImg';

const MessageInput = ({ setMessages }) => {
  const [inputdata, setInputData] = useState("");
  const selectconversation = useRecoilValue(selectConversation);
  const toast = showToast();
  const selectConversations = useSetRecoilState(chatAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure(); // Move useDisclosure inside the component function
  const { handleImage, imageurl, setImageUrl } = previewImg();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    console.log(inputdata)
		e.preventDefault();
		if (!inputdata && !imageurl) return;
		if (isSending) return;
		setIsSending(true);

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message:inputdata,
					recipientId:selectconversation.userId,
          img:imageurl
				}),
			});
			const data = await res.json();
			if (data.error) {
				toast("Error", data.error, "error");
				return;
			}
			setMessages((messages) => [...messages, data]);
			selectConversations((prevConvs) => {
				const updatedConversations = prevConvs.map((conversation) => {
					if (conversation._id === selectconversation._id) {
						return {
							...conversation,
							lastMessage: {
								text: inputdata,
								sender: data.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});    
      setInputData("");
			setImageUrl(""); 
		} catch (error) {
			toast("Error", error.message, "error");
		} finally {
			setIsSending(false);
		}
	};

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder='Type a message'
            onChange={(e) => setInputData(e.target.value)}
            value={inputdata}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type={"file"} hidden ref={imageRef} onChange={handleImage} />
      </Flex>
      <Modal
        isOpen={imageurl}
        onClose={() => {
          onClose();
          setImageUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imageurl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
