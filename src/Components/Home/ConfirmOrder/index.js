import React from "react";
import { List, Card, Modal,Spin } from "antd";

export default ({
  fileList,
  confirmOrder,
  showModal,
  hideModal,
  visible,
  cancelOrderConfirm,
  erratpage,
  loaderforPages
}) => {
  console.log(erratpage,loaderforPages);
  
  return(
  <div className="confirmOrder-container">
  {/* {loaderforPages ? <Spin/> :
  <div> */}
  {/* {erratpage ? <div>
    <h1>Something went wrong while getting the pages </h1>
    <h2>Please Press next to confirm your order and upload ur file</h2>
    <h3>Ur order will be Cash on Delivery</h3> */}
  {/* </div>: */}
  <List
      itemLayout="horizontal"
      dataSource={fileList}
      renderItem={(item, index) => (
        <List.Item className="list-item">
          <Card title={item.name} bordered={false} style={{ width: 300 }}>
            <p>Pages: {item.pages}</p>
            <p>Cost per page: 1</p>
            <p>
              Total cost: {item.pages} x 1 = {item.pages * 1}
            </p>
          </Card>
        </List.Item>
      )}
    />
    
    <div className="upload-button-group">
      <div className="upload-button cancel-button" onClick={showModal}>
        Cancel
      </div>{" "}
      <div
        onClick={confirmOrder}
        className="upload-button upload-button-border"
      >
        Confirm Order
      </div>
    </div>
    <Modal
      title="Cancel Order?"
      visible={visible}
      onOk={cancelOrderConfirm}
      onCancel={hideModal}
      okText="Yes"
      cancelText="No"
    >
      <p>Are you sure to cancel the order?</p>
    </Modal>
  </div>)}
    // }
  // </div>
// )}
