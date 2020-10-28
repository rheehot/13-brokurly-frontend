import React, { Component } from "react";

import "./ProductDetailsReview.styles.scss";

class ProductDetailsReview extends Component {
  state = {
    activeContent: 0,
    newReviewTitle: "",
    newReviewContent: "",
  };

  getNewReviewValue = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  postNewReview = async (e, id) => {
    e.preventDefault();
    const { newReviewContent, newReviewTitle } = this.state;
    try {
      const response = await fetch("http://10.58.6.216:8000/user/user-review", {
        method: "POST",
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiaGFydW0ifQ.nMUcgev8vz4rbQY-3z2F0tFFSKQjBMgwCVWOOTm91Qw",
        },
        body: JSON.stringify({
          title: newReviewTitle,
          content: newReviewContent,
          product_id: id,
        }),
      });
      const result = await response.json();
      console.log(result);
      this.setState({ newReviewContent: "", newReviewTitle: "" });
    } catch (error) {
      console.log("!!error error!!");
    }
  };

  postReviewCount = async (id) => {
    try {
      const response = await fetch(
        "http://10.58.6.216:8000/user/product/5/reviews",
        {
          method: "POST",
          body: JSON.stringify({ review_id: id }),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log("!!error_error!!");
    }
  };

  openContent = (e, reviewId) => {
    this.postReviewCount(reviewId);
    let id = "";
    e.target.tagName === "TD"
      ? (id = e?.target.parentElement.dataset.idx)
      : (id = e?.target.dataset.idx);

    this.setState({
      activeContent: id,
    });
  };

  getPage = async (e) => {
    const offset = e?.target.dataset.idx * 10;
    const limit = offset + 10;
    const response = await fetch(
      `http://10.58.6.216:8000/user/product/5/reviews?offset=${offset}&limit=${limit}`,
      { method: "GET" }
    );
    const { review_list } = await response.json();
    this.setState({
      reviewList: review_list,
    });
  };

  getRequestData = async () => {
    const OFFSET = 0;
    const LIMIT = 10;
    const response = await fetch(
      `http://10.58.6.216:8000/user/product/5/reviews?offset=${OFFSET}&limit=${LIMIT}`,
      { method: "GET" }
    );
    const { review_list, total_count } = await response.json();
    const totalPages = [];
    const pages =
      total_count % LIMIT
        ? Math.floor(total_count / LIMIT) + 1
        : Math.floor(total_count / LIMIT);
    for (let i = 1; i <= pages; i++) {
      totalPages.push(i);
    }

    this.setState({
      reviewList: review_list,
      totalCount: total_count,
      totalPages,
    });
  };

  componentDidMount() {
    this.getRequestData();
  }

  // conditional rendering
  // !data.length && return <div>Loading...</div>
  render() {
    const {
      reviewList,
      activeContent,
      totalPages,
      newReviewTitle,
      newReviewContent,
    } = this.state;
    const { productDetail } = this.props;

    return (
      <div className="ProductDetailsRequest">
        <div className="review-header">
          <h5>product review</h5>
          <div className="review-caution">
            <ul>
              <li>
                상품에 대한 문의를 남기는 공간입니다. 해당 게시판의 성격과 다른
                글은 사전동의 없이 담당 게시판으로 이동될수 있습니다.
              </li>
              <li>
                배송관련, 주문(취소/교환/환불) 관련 문의 및 요청사항은 마이컬리
                내 <u>1:1문의</u> 에 남겨주세요.
              </li>
            </ul>
            <select name="" id="">
              <option value="1">최근등록순</option>
              <option value="2">좋아요많은순</option>
              <option value="3">조회많은순</option>
            </select>
          </div>
        </div>
        <div className="review-board">
          <table className="review-thead">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>회원등급</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>도움</th>
                <th>조회</th>
              </tr>
            </thead>
          </table>
          <ul className="review-list">
            {reviewList &&
              reviewList.map((review) => {
                return (
                  <li key={review.id}>
                    <table className="review-tbody">
                      <tbody>
                        <tr
                          data-idx={review.id}
                          onClick={(e) => this.openContent(e, review.id)}
                        >
                          <td>{review.id}</td>
                          <td>{review.title}</td>
                          <td>{review.user_rank}</td>
                          <td>{review.user_name}</td>
                          <td>{review.create_time}</td>
                          <td>{review.help_count}</td>
                          <td>{review.views_count}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      className={`review-content ${
                        +activeContent === review.id ? "" : "display-none"
                      }`}
                    >
                      <h3>{review.product_name}</h3>
                      <img src={review.image_url} alt="" />
                      <p>{review.content}</p>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="review-write">
          <form action="" className="review-input">
            <input
              type="text"
              name="newReviewTitle"
              onChange={this.getNewReviewValue}
              value={newReviewTitle}
            />
            <input
              type="text"
              name="newReviewContent"
              onChange={this.getNewReviewValue}
              value={newReviewContent}
            />
          </form>
          <button onClick={(e) => this.postNewReview(productDetail.id)}>
            후기쓰기
          </button>
        </div>

        <div className="pagination">
          <ul>
            <li>
              <i className="fas fa-angle-double-left" />
            </li>
            <li>
              <i className="fas fa-angle-left" />
            </li>
            {totalPages &&
              totalPages.map((page, idx) => (
                <li key={idx} data-idx={idx} onClick={this.getPage}>
                  {page}
                </li>
              ))}

            <li>
              <i className="fas fa-angle-right" />
            </li>
            <li>
              <i className="fas fa-angle-double-right" />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProductDetailsReview;
