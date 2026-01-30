import { NEWS_HEADLINES } from './flowConfig'

const NewsTicker = () => (
  <div className="news-ticker-container">
    <div className="news-ticker-wrapper">
      <div className="news-ticker-track">
        {NEWS_HEADLINES.concat(NEWS_HEADLINES).map((item, idx) => (
          <div key={idx} className="ticker-item">
            <span className="ticker-tag">{item.tag}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default NewsTicker
