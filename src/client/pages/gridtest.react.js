import './gridtest.scss';

import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';

export default class GridTestIndex extends Component {

  render() {

    const oddEven = (i) => {
      const isOdd = i & 1;
      return isOdd ? 'odd' : 'even';
    };

    return (
      <DocumentTitle title="Page 2">
        <div>
          <div className="row">
            {[...Array(12)].map((x, i) => {
              const classNames = 'small-1 block columns ' + oddEven(i);
              return <div className={classNames}>col-{i + 1}</div>;
            })}
          </div>

          <br />

          <div className="row">
            {[...Array(12)].map((x, i) => {
              const classNames = 'spanblock ' + oddEven(i);
              return (
                <div className="small-1 block columns">
                  <span className={classNames}>col-{i + 1}</span>
                </div>
              );
            })}
          </div>

          <br />

          <div className="row">
            {[...Array(6)].map((x, i) => {
              const classNames = 'spanblock ' + oddEven(i);
              return (
                <div className="small-2 block columns">
                  <span className={classNames}>col-{i + 1}</span>
                </div>
              );
            })}
          </div>

          <br />

          <div className="row">
            {[...Array(4)].map((x, i) => {
              const classNames = 'spanblock ' + oddEven(i);
              return (
                <div className="small-3 block columns">
                  <span className={classNames}>col-{i + 1}</span>
                </div>
              );
            })}
          </div>

          <br />

          <div className="row">
            {[...Array(3)].map((x, i) => {
              const classNames = 'spanblock ' + oddEven(i);
              return (
                <div className="small-4 block columns">
                  <span className={classNames}>col-{i + 1}</span>
                </div>
              );
            })}
          </div>

          <br />

          <div className="row">
            {[...Array(2)].map((x, i) => {
              const classNames = 'spanblock ' + oddEven(i);
              return (
                <div className="small-6 block columns">
                  <span className={classNames}>col-{i + 1}</span>
                </div>
              );
            })}
          </div>

          <br />

          <div className="row">
            <div className="small-12 columns block">
              <span className="spanblock odd">col-1</span>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="small-6 columns">
              <div className="row">
                {[...Array(4)].map((x, i) => {
                  const classNames = 'spanblock ' + oddEven(i);
                  return (
                    <div className="small-3 block columns">
                      <span className={classNames}>col-{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="small-6 columns">
              <div className="row">
                {[...Array(4)].map((x, i) => {
                  const classNames = 'spanblock ' + oddEven(i);
                  return (
                    <div className="small-3 block columns">
                      <span className={classNames}>col-{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </DocumentTitle>
    );
  }

}
