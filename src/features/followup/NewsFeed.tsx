import type { NewsArticle } from '../../data'

type NewsFeedProps = {
    articles: NewsArticle[]
    title?: string
}

const getSentimentColor = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
        case 'POSITIVE':
            return '#34d399'
        case 'NEGATIVE':
            return '#f87171'
        default:
            return '#94a3b8'
    }
}

const getSentimentLabel = (sentiment: NewsArticle['sentiment']) => {
    switch (sentiment) {
        case 'POSITIVE':
            return '▲ 호재'
        case 'NEGATIVE':
            return '▼ 악재'
        default:
            return '● 중립'
    }
}

const NewsFeed = ({ articles, title = '관련 뉴스' }: NewsFeedProps) => {
    if (articles.length === 0) {
        return (
            <div className="news-feed-panel">
                <h4>{title}</h4>
                <p className="news-empty">관련 뉴스가 없습니다.</p>
            </div>
        )
    }

    return (
        <div className="news-feed-panel">
            <h4>{title}</h4>
            <div className="news-list">
                {articles.map((article) => (
                    <div key={article.id} className="news-item">
                        <div className="news-item-header">
                            <span
                                className="news-sentiment"
                                style={{ color: getSentimentColor(article.sentiment) }}
                            >
                                {getSentimentLabel(article.sentiment)}
                            </span>
                            <span className="news-date">{article.date}</span>
                        </div>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-title"
                        >
                            {article.title}
                        </a>
                        <span className="news-source">{article.source}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NewsFeed
