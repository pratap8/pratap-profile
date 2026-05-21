import React from "react";
import "./PublicationCard.css";

const PublicationCard = ({ publication, index, onViewPatent }) => {
  return (
    <div className="publication-card">
      <p className="pub-description">{publication.description}</p>

      <div className="pub-details">
        {publication.publishedIn && (
          <p>
            <strong>Published In:</strong> {publication.publishedIn}
          </p>
        )}
        {publication.date && (
          <p>
            <strong>Date:</strong> {publication.date}
          </p>
        )}
        {publication.designNumber && (
          <p>
            <strong>Design Number:</strong> {publication.designNumber}
          </p>
        )}
        {publication.application && (
          <p>
            <strong>Application No:</strong> {publication.application}
          </p>
        )}
        {publication.journalNumber && (
          <p>
            <strong>Journal No:</strong> {publication.journalNumber}
          </p>
        )}
        {publication.volume && (
          <p>
            <strong>Volume:</strong> {publication.volume}
          </p>
        )}
      </div>

      {index === 1 ? (
        <div className="button-group">
          <button onClick={onViewPatent} className="view-btn">
            View Design Patent
          </button>
          <a
            href={publication.link}
            target="_blank"
            rel="noopener noreferrer"
            className="view-btn"
          >
            View Publication
          </a>
        </div>
      ) : (
        <a
          href={publication.link}
          target="_blank"
          rel="noopener noreferrer"
          className="view-btn"
        >
          View Publication
        </a>
      )}
    </div>
  );
};

export default PublicationCard;
