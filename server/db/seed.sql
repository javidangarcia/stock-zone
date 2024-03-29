-- Seeding data into the users table
INSERT INTO users (name, username, email, password, picture) VALUES
('John Smith', 'johnsmith', 'johnsmith@example.com', '$2b$10$ZRkNHialt/6V9hqQK0ikN.1e.Rl7Oibt.EDAMTpM7XrOv6uHnSsqK', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Jane Johnson', 'janejohnson', 'janejohnson@example.com', '$2b$10$ZRkNHialt/6V9hqQK0ikN.1e.Rl7Oibt.EDAMTpM7XrOv6uHnSsqK', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Michael Brown', 'michaelbrown', 'michaelbrown@example.com', '$2b$10$ZRkNHialt/6V9hqQK0ikN.1e.Rl7Oibt.EDAMTpM7XrOv6uHnSsqK', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Emily Lee', 'emilylee', 'emilylee@example.com', '$2b$10$ZRkNHialt/6V9hqQK0ikN.1e.Rl7Oibt.EDAMTpM7XrOv6uHnSsqK', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('William Wilson', 'williamwilson', 'williamwilson@example.com', '$2b$10$ZRkNHialt/6V9hqQK0ikN.1e.Rl7Oibt.EDAMTpM7XrOv6uHnSsqK', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg');


-- Seeding data into the stocks table
INSERT INTO stocks (ticker, name, description, sector, price, logo) VALUES
('META', 'Meta Platforms Inc.', 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, PCs, virtual reality headsets, wearables and home devices around the world. The company is headquartered in Menlo Park, California.', 'Technology', 312.83, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.svg'),
('GOOG', 'Alphabet Inc Class C', 'Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It was created through a restructuring of Google on October 2, 2015, and became the parent company of Google and several former Google subsidiaries. The two co-founders of Google remained as controlling shareholders, board members, and employees at Alphabet. Alphabet is the world''s fourth-largest technology company by revenue and one of the world''s most valuable companies.', 'Technology', 131.6899, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/GOOG.svg'),
('NFLX', 'Netflix Inc', 'Netflix, Inc. is an American over-the-top content platform and production company headquartered in Los Gatos, California. Netflix was founded in 1997 by Reed Hastings and Marc Randolph in Scotts Valley, California. The company''s primary business is a subscription-based streaming service offering online streaming from a library of films and television series, including those produced in-house.', 'Trade & Services', 440.76, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NFLX.svg'),
('MSFT', 'Microsoft Corporation', 'Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services. Its best-known software products are the Microsoft Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers. Its flagship hardware products are the Xbox video game consoles and the Microsoft Surface lineup of touchscreen personal computers. Microsoft ranked No. 21 in the 2020 Fortune 500 rankings of the largest United States corporations by total revenue; it was the world''s largest software maker by revenue as of 2016. It is considered one of the Big Five companies in the U.S. information technology industry, along with Google, Apple, Amazon, and Facebook.', 'Technology', 330.11, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/MSFT.svg'),
('AAPL', 'Apple Inc', 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services. Apple is the world''s largest technology company by revenue (totalling $274.5 billion in 2020) and, since January 2021, the world''s most valuable company. As of 2021, Apple is the world''s fourth-largest PC vendor by unit sales, and fourth-largest smartphone manufacturer. It is one of the Big Five American information technology companies, along with Amazon, Google, Microsoft, and Facebook.', 'Technology', 178.51, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.svg');


-- Seeding data into the follows table
INSERT INTO follows (userid, stockid) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 2), (2, 4), (2, 5), (3, 1), (3, 4),
(3, 5), (4, 3), (4, 5), (4, 1), (5, 1),
(5, 5), (5, 2);


-- Seeding data into the likes table
INSERT INTO likes (userid, stockid) VALUES
(1, 1), (1, 2), (1, 3), (2, 4), (2, 5), 
(3, 1), (3, 2), (3, 3), (4, 4), (4, 5),
(5, 1), (5, 2), (5, 3);


-- Seeding data into the dislikes table
INSERT INTO dislikes (userid, stockid) VALUES
(1, 4), (1, 5), (2, 1), (2, 2), (2, 3),
(3, 4), (3, 5), (4, 1), (4, 2), (4, 3),
(5, 4), (5, 5);


-- Seeding data into the comments table
INSERT INTO comments (content, userid, stockid) VALUES
('Great company!', 1, 1),
('Impressive performance.', 1, 2),
('Exciting developments in technology!', 1, 3),
('Love their products!', 2, 1),
('Their innovations are unmatched.', 2, 4),
('Looking forward to their future projects.', 2, 5),
('Interesting developments in the industry.', 3, 2),
('The future looks bright for this stock.', 3, 3),
('Holding strong amid market challenges.', 3, 4),
('Best stock investment!', 4, 1),
('Their financials are impressive.', 4, 2),
('Diversifying my portfolio with this stock.', 4, 3),
('Incredible potential for growth.', 5, 1),
('Their market dominance is impressive.', 5, 4),
('Optimistic about the long-term prospects.', 5, 5);


-- Seeding data into the friends table
INSERT INTO friends (senderid, receiverid) VALUES
(1, 2), (2, 1), (1, 3), (3, 1), (2, 3), (3, 2),
(4, 5), (5, 4), (4, 1), (1, 4), (5, 2), (2, 5);


-- Seeding data into the posts table
INSERT INTO posts (title, content, userid) VALUES
('Exploring the Future of Technology', 'As I gaze into the future, I can''t help but marvel at the technological advancements poised to reshape our world. From artificial intelligence to quantum computing, the possibilities seem endless. I firmly believe we''re standing on the brink of a technological revolution that will redefine how we live, work, and interact with one another. What are your thoughts on the future of technology? Are you excited about the prospects or wary of the potential pitfalls?', 1),
('My Latest Investment Strategies', 'Lately, I''ve been reevaluating my investment strategies to ensure I''m positioned for long-term success. I''ve been focusing on diversifying my portfolio with a mix of stocks, bonds, and alternative assets to mitigate risk and capture opportunities in various market conditions. It''s a delicate balance between growth and stability. How do you approach investment in today''s dynamic market landscape? I''m always eager to learn from others'' perspectives and experiences.', 2),
('Innovation in the Tech Industry', 'The tech industry never ceases to amaze me with its relentless pace of innovation. From groundbreaking advancements in artificial intelligence and machine learning to transformative developments in renewable energy and biotechnology, there''s no shortage of exciting developments on the horizon. As we embrace this era of rapid change, it''s crucial to stay informed and adaptable. What emerging technologies or trends do you find most intriguing? Let''s dive into the discussion and explore the boundless possibilities together.', 3),
('Book Recommendations for 2024', 'As avid readers, we''re always on the lookout for captivating books to enrich our minds and expand our horizons. With the new year upon us, it''s the perfect time to compile a list of must-read titles for 2024. Whether it''s thought-provoking fiction, insightful non-fiction, or captivating memoirs, there''s something for everyone to discover. Do you have any favorite books you''re excited to delve into this year? Share your recommendations, and let''s embark on a literary journey together.', 4),
('Challenges in the Manufacturing Sector', 'The manufacturing sector faces a myriad of challenges in today''s global economy, from supply chain disruptions and labor shortages to regulatory hurdles and technological complexities. As industry leaders and innovators, it''s imperative that we come together to address these challenges head-on and explore viable solutions. Whether it''s embracing automation and digital transformation or fostering collaboration and knowledge sharing, there''s no shortage of opportunities to drive positive change and shape the future of manufacturing.', 5);


-- Seeding data into the replies table
INSERT INTO replies (content, userid, postid) VALUES
('I agree! The future of technology looks promising.', 2, 1),
('What types of investments do you prefer?', 3, 2),
('The tech industry is indeed dynamic. Any specific areas you find most interesting?', 4, 3),
('Have you considered reading ''The Innovators'' by Walter Isaacson? It''s a great tech-related book!', 5, 4),
('Addressing challenges in manufacturing requires collaborative efforts. What are your thoughts on potential solutions?', 1, 5),
('I''ve heard about some exciting developments in AI. What are your thoughts?', 3, 1),
('I''m also interested in investment strategies. Let''s exchange ideas!', 1, 2),
('Innovation in AI and machine learning is fascinating. Do you have any favorite projects?', 2, 3),
('I recently read ''Sapiens'' by Yuval Noah Harari. Highly recommend!', 4, 4),
('Collaborative research and development can help overcome manufacturing challenges. Let''s discuss!', 5, 5);


-- Seeding data into the messages table with corrected room IDs
INSERT INTO messages (room, content, senderid, receiverid) VALUES
('janejohnsonjohnsmith', 'Hey, how are you doing?', 1, 2),
('janejohnsonjohnsmith', 'I found this interesting article about technology trends. Check it out!', 2, 1),
('janejohnsonmichaelbrown', 'Planning to attend a tech conference next month. Interested?', 2, 3),
('janejohnsonmichaelbrown', 'Absolutely! Count me in. Let me know the details.', 3, 2),
('williamwilsonemilylee', 'I''m thinking of investing in some tech stocks. Any recommendations?', 4, 5),
('williamwilsonemilylee', 'Sure, I can help you with that. Let''s discuss over coffee.', 5, 4),
('johnsmithemilylee', 'Just wanted to say hi! How''s your day going?', 1, 3),
('johnsmithemilylee', 'Hi there! My day is going well. Thanks for asking!', 3, 1),
('johnsmithmichaelbrown', 'Received an interesting job offer today. Excited!', 4, 2),
('johnsmithmichaelbrown', 'That''s fantastic news! Congratulations!', 2, 4),
('johnsmithwilliamwilson', 'What''s the latest book you''ve read? Looking for recommendations.', 5, 1),
('johnsmithwilliamwilson', 'I recently finished ''Sapiens'' by Yuval Noah Harari. Highly recommend!', 1, 5);
