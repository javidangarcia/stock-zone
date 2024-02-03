-- Seeding data into the users table
INSERT INTO users (name, username, email, password, picture) VALUES
('John Smith', 'johnsmith', 'johnsmith@example.com', 'meta123', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Jane Johnson', 'janejohnson', 'janejohnson@example.com', 'meta123', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Michael Brown', 'michaelbrown', 'michaelbrown@example.com', 'meta123', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('Emily Lee', 'emilylee', 'emilylee@example.com', 'meta123', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg'),
('William Wilson', 'williamwilson', 'williamwilson@example.com', 'meta123', 'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg');


-- Seeding data into the stocks table
INSERT INTO stocks (ticker, name, description, sector, price, logo) VALUES
('META', 'Meta Platforms Inc.', 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, PCs, virtual reality headsets, wearables and home devices around the world. The company is headquartered in Menlo Park, California.', 'Technology', 312.83, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.svg'),
('GOOG', 'Alphabet Inc Class C', 'Alphabet Inc. is an American multinational conglomerate headquartered in Mountain View, California. It was created through a restructuring of Google on October 2, 2015, and became the parent company of Google and several former Google subsidiaries. The two co-founders of Google remained as controlling shareholders, board members, and employees at Alphabet. Alphabet is the world''s fourth-largest technology company by revenue and one of the world''s most valuable companies.', 'Technology', 131.6899, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/GOOG.svg'),
('AMZN', 'Amazon.com Inc', 'Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. It is one of the Big Five companies in the U.S. information technology industry, along with Google, Apple, Microsoft, and Facebook. The company has been referred to as one of the most influential economic and cultural forces in the world, as well as the world''s most valuable brand.', 'Trade & Services', 142.25, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMZN.svg'),
('TSLA', 'Tesla Inc', 'Tesla, Inc. is an American electric vehicle and clean energy company based in Palo Alto, California. Tesla''s current products include electric cars, battery energy storage from home to grid-scale, solar panels and solar roof tiles, as well as other related products and services. In 2020, Tesla had the highest sales in the plug-in and battery electric passenger car segments, capturing 16% of the plug-in market (which includes plug-in hybrids) and 23% of the battery-electric (purely electric) market. Through its subsidiary Tesla Energy, the company develops and is a major installer of solar photovoltaic energy generation systems in the United States. Tesla Energy is also one of the largest global suppliers of battery energy storage systems, with 3 GWh of battery storage supplied in 2020.', 'Manufacturing', 250.35, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/TSLA.svg'),
('MSFT', 'Microsoft Corporation', 'Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services. Its best-known software products are the Microsoft Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers. Its flagship hardware products are the Xbox video game consoles and the Microsoft Surface lineup of touchscreen personal computers. Microsoft ranked No. 21 in the 2020 Fortune 500 rankings of the largest United States corporations by total revenue; it was the world''s largest software maker by revenue as of 2016. It is considered one of the Big Five companies in the U.S. information technology industry, along with Google, Apple, Amazon, and Facebook.', 'Technology', 330.11, 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/MSFT.svg');


-- Seeding data into the follows table
INSERT INTO follows (userid, stockid) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 2), (2, 4), (2, 5), (3, 1), (3, 4),
(3, 5), (4, 3), (4, 5), (4, 1), (5, 1),
(5, 5), (5, 2);


-- Seeding data into the likes table
INSERT INTO likes (userid, stockid) VALUES
(1, 2), (1, 3), (1, 5), (2, 1), (2, 4),
(2, 5), (3, 1), (3, 5), (3, 2), (4, 2),
(4, 3), (4, 5), (5, 4), (5, 5), (5, 1);


-- Seeding data into the dislikes table
INSERT INTO dislikes (userid, stockid) VALUES
(1, 4), (1, 5), (1, 1), (2, 1), (2, 3),
(2, 4), (3, 2), (3, 4), (3, 5), (4, 1),
(4, 5), (4, 2), (5, 2), (5, 3), (5, 4);


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
('Exploring the Future of Technology', 'I believe we are on the brink of a technological revolution. What are your thoughts on the future?', 1),
('My Latest Investment Strategies', 'Diversifying my portfolio with a mix of stocks and bonds. How do you approach investment?', 2),
('Innovation in the Tech Industry', 'The pace of innovation in the tech industry is astonishing. Exciting times ahead!', 3),
('Book Recommendations for 2024', 'Looking for some great reads this year. Any book recommendations?', 4),
('Challenges in the Manufacturing Sector', 'The manufacturing sector is facing various challenges. Let''s discuss possible solutions.', 5);


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
